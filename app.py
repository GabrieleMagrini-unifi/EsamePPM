from flask import Flask, render_template, request
from franz.openrdf.sail.allegrographserver import AllegroGraphServer
from franz.openrdf.repository.repository import Repository
from franz.openrdf.query.query import QueryLanguage
import re
from wikiapi import WikiApi
import datetime

# fixme tipo di articolo insieme al titolo e data on top
# fixme subquery all'apertura dell'accordion --> loading animation
# fixme titolo + qualcosina nella navbar


HOST = "93.149.230.145"
#HOST = "localhost"
PORT = 10035
USER = "manu"
PASSWORD = "manu"

server = AllegroGraphServer(HOST, PORT, USER, PASSWORD)
conn = server.openCatalog("main").getRepository("galileo", Repository.OPEN).getConnection()

app = Flask(__name__)

wiki = WikiApi({'locale': 'es'})


def get_wiki_image(name: str):
    print(name, name.replace(',', ''))
    splitted = name.split(',')
    results = wiki.find(splitted[1] + " " + splitted[0] if len(splitted) > 1 else name)
    picture = None
    if len(results):
        article = wiki.get_article(results[0])
        picture = article.image
    print(picture)
    return picture


def sanitize_lang(langs: str) -> list:
    result = []
    for lang in langs.split(" "):
        result.append(lang)
    return result if not langs == "" else []


def _roman_to_int(s):
    """
    :type s: str
    :rtype: int
    """
    roman = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000, 'IV': 4, 'IX': 9, 'XL': 40, 'XC': 90,
             'CD': 400, 'CM': 900}
    i = 0
    num = 0
    while i < len(s):
        if i + 1 < len(s) and s[i:i + 2] in roman:
            num += roman[s[i:i + 2]]
            i += 2
        else:
            num += roman[s[i]]
            i += 1
    return num


def roman_to_int(dates: list):
    return _roman_to_int(dates[0]), _roman_to_int(dates[1])


def sanitize_date(date: str):
    # format 1000-1100
    arab_range = re.compile('[0-9]+-[0-9]+')
    arab_single = re.compile('[0-9]+')
    roman_range = re.compile('[CDILMVX]+-[CDILMVX]+')
    roman_single = re.compile('[CDILMVX]+')
    bc = False
    start = stop = ''
    if re.findall(".*[ab]\.c.*", date, re.IGNORECASE):
        bc = True
    if match := re.findall(arab_range, date):
        start, stop = str(match[0]).split('-')
    elif match := re.findall(roman_range, date):
        start, stop = roman_to_int(str(match[0]).split('-'))
        start *= 100
        stop *= 100
    elif match := re.findall(arab_single, date):
        if len(match) == 1:
            start = stop = match[0]
        else:
            start, stop = match[0], match[1]
    elif match := re.findall(roman_single, date):
        if len(match) == 1:
            start, stop = roman_to_int(match * 2)
        else:
            start, stop = roman_to_int(match)
        start *= 100
        stop *= 100
    else:
        # per convenzione i senza data sono datati 0
        start = stop = 0
    if bc:
        start = -int(start)
        stop = -int(stop)
    else:
        start = int(start)
        stop = int(stop)
    return start, stop


def contained(superset: tuple[int, int], subset: tuple[int, int]) -> bool:
    return superset[0] <= subset[0] and subset[1] <= superset[1]


@app.route("/details", methods=['GET'])
def retrieve_authors_details():
    author_id = request.values['id']
    author_name = request.values['name']
    query = """
        SELECT ?resource_id ?title WHERE {
            ?resource_id dcterms:creator %s .
            ?resource_id rdfs:label ?title .
        }
    """ % author_id
    print("\n", query, "\n")
    result = conn.prepareTupleQuery(QueryLanguage.SPARQL, query).evaluate()
    works = []
    for r in result:
        works.append((str(r.getValue('title'))[1:-1], str(r.getValue('resource_id'))))
    d = {'works': works, 'picture': get_wiki_image(author_name)}
    return render_template("author_details.html", details=d)


@app.route("/")
def index():
    e = {'min_date': "10000 AC",
         'max_date': datetime.datetime.now().year}
    return render_template("index.html", env=e)


@app.route("/authors", methods=['GET', 'POST'])
def authors_search_result():
    authors = []
    sparql_query_elements = {
        'input': request.values['input'] if 'input' in request.values.keys() else ""
    }
    query = """
                SELECT DISTINCT ?code ?name WHERE {
                    ?code rdf:type foaf:Person .
                    ?code foaf:name ?name filter contains(lcase(?name), lcase("%s")) .
                    ?resource_id dcterms:creator ?code .
                    ?resource_id rdfs:label ?title .
                } order by ?code """ % sparql_query_elements['input']
    query_result = conn.prepareTupleQuery(QueryLanguage.SPARQL, query).evaluate()
    for r in query_result:
        if len(authors) < 1 or authors[-1]['id'] not in str(r.getValue('code')):
            authors.append({'id': str(r.getValue('code')), 'name': str(r.getValue('name'))[1:-1]  # ,
                            # 'works': [
                            #    (str(r.getValue('title'))[1:-1], str(r.getValue('resource_id')))
                            # ]
                            #   , 'picture': get_wiki_image(str(r.getValue('name'))[1:-1])
                            })
        else:
            continue
            authors[-1]['works'].append((str(r.getValue('title'))[1:-1], str(r.getValue('resource_id'))))
    return render_template("authors_search.html", authors=authors)


@app.route("/resources", methods=['GET', 'POST'])
def resources_search_result():
    # dizioniario roba get
    # sparql_query_elements = request.values
    sparql_query_elements = {
        'input': request.values['input'] if 'input' in request.values.keys() else "",
        'publisher': request.values['publisher'] if 'publisher' in request.values.keys() else "",
        'min_date': request.values['min_date'] if 'min_date' in request.values.keys() else "",
        'max_date': request.values['max_date'] if 'max_date' in request.values.keys() else "",
        'languages': request.values['languages'] if 'languages' in request.values.keys() else "",
        'author': request.values['author'] if 'author' in request.values.keys() else "",
    }

    sparql_query_elements['languages'] = sanitize_lang(sparql_query_elements['languages'])
    author_filter = publisher_filter = language_filter = ""

    if not sparql_query_elements['author'] == "":
        author_filter = """ filter contains(?creator_name, "%s") 
            """ % sparql_query_elements['author']

    if not sparql_query_elements['publisher'] == "":
        publisher_filter = """ filter contains(?publisher_name, "%s")
            """ % sparql_query_elements['publisher']

    if len(sparql_query_elements['languages']) > 0:
        language_filter = "?code dcterms:language ?lang filter ("
        for lang in sparql_query_elements['languages']:
            language_filter += f'(?lang = "{lang}") || '
        language_filter = language_filter[:-3] + ") ."
    query = """
               SELECT ?code ?title ?date ?creator_name ?publisher_name WHERE {{                   
               ?code rdfs:label ?title filter contains (lcase(?title), lcase("%s")) .
                    ?code dcterms:issued ?date .
                    ?code dcterms:creator ?creator .
                    ?creator foaf:name ?creator_name .
                    ?code dcterms:publisher ?pub .
                    ?pub foaf:name ?publisher_name %s.
            """ % (
        sparql_query_elements['input'],
        publisher_filter) + author_filter + publisher_filter + language_filter + "} UNION"
    query += """{                   
               ?code rdfs:label ?title filter contains (lcase(?title), lcase("%s")) .
                    ?code dcterms:issued ?date .
                    ?code dcterms:creator ?creator .
                    ?creator foaf:name ?creator_name .
                    ?code dcterms:publisher ?pub .
                    ?pub foaf:name ?publisher_name %s.""" % (sparql_query_elements['input'], publisher_filter) \
             + author_filter + publisher_filter + "} } order by desc(?lang) asc(?code)"

    resources = []

    print(query)
    query_result = conn.prepareTupleQuery(QueryLanguage.SPARQL, query).evaluate()
    if sparql_query_elements['min_date'] == "":
        sparql_query_elements['min_date'] = -10000
    elif re.findall("[aA].?[cC]?.", sparql_query_elements['min_date']):
        sparql_query_elements['min_date'] = -int(re.findall("[0-9]*", sparql_query_elements['min_date'])[0])
    else:
        sparql_query_elements['min_date'] = int(re.findall("[0-9]*", sparql_query_elements['min_date'])[0])

    if sparql_query_elements['max_date'] == "":
        sparql_query_elements['max_date'] = datetime.datetime.now().year
    elif re.findall("[aA].?[cC]?.", sparql_query_elements['max_date']):
        sparql_query_elements['max_date'] = -int(re.findall("[0-9]*", sparql_query_elements['max_date'])[0])
    else:
        sparql_query_elements['max_date'] = int(re.findall("[0-9]*", sparql_query_elements['max_date'])[0])
    for r in query_result:
        if contained((int(sparql_query_elements['min_date']), int(sparql_query_elements['max_date'])),
                     sd := sanitize_date(str(r.getValue('date')))):
            if len(resources) < 1 or resources[len(resources) - 1]['id'] not in str(r.getValue('code')):

                resources.append(
                    {'id': str(r.getValue('code')), 'title': str(r.getValue('title'))[1:-1],
                     'date': str(r.getValue('date'))[1:-1],
                     'creator': str(r.getValue('creator_name'))[1:-1],
                     'publisher': str(r.getValue('publisher_name'))[1:-1],
                     'preview': str(r.getValue('title'))[1:81] + "..." if len(str(r.getValue('title'))) > 82
                     else str(r.getValue('title'))[1:-1],
                     'sanitized_date': str(sd[0]) if sd[0] == sd[1] else str(sd[0]) + "-" + str(sd[1])}
                )
            else:
                resources[-1]['creator'] += "; " + str(r.getValue('creator_name'))[1:-1]
    # query_results = execute_query(query)
    return render_template("resources_search.html", results=resources)


@app.route("/resource_link", methods=['GET', 'POST'])
def resources_direct_search():
    sparql_query_elements = {
        'code': request.values['code'] if 'code' in request.values.keys() else ""
    }

    query = """
                SELECT ?code ?title ?creator_name WHERE {                   
                    ?code rdfs:label ?title filter (?code=%s) .
                    ?code dcterms:creator ?creator .
                    ?creator foaf:name ?creator_name .
                }
            """ % sparql_query_elements['code']

    article = conn.prepareTupleQuery(QueryLanguage.SPARQL, query).evaluate()
    result = []
    for art in article:
        if len(result) < 1 or result[len(result) - 1]['id'] not in str(art.getValue('code')):

            sub_query_issued = """SELECT ?code ?date WHERE {?code dcterms:issued ?date . filter (?code=%s)}""" % \
                               sparql_query_elements['code']
            sub_query_publisher = """
                    SELECT ?code ?publisher_name WHERE {
                        ?code dcterms:publisher ?pub filter (?code=%s).
                        ?pub foaf:name ?publisher_name .
                    } order by ?code """ % sparql_query_elements['code']

            iss = conn.prepareTupleQuery(QueryLanguage.SPARQL, sub_query_issued).evaluate()
            pub = conn.prepareTupleQuery(QueryLanguage.SPARQL, sub_query_publisher).evaluate()

            print(sub_query_issued, '\n\n\n\n\n', sub_query_publisher)

            issued = publisher = ""

            if iss.rowCount() >= 1:
                for i in iss:
                    issued = str(i.getValue('date'))[1: -1]

            if pub.rowCount() >= 1:
                for p in pub:
                    publisher = str(p.getValue('publisher_name'))[1: -1]

            result.append(
                {'id': str(art.getValue('code')), 'title': str(art.getValue('title'))[1:-1],
                 'creator': str(art.getValue('creator_name'))[1:-1],
                 'publisher': publisher, 'date': issued,
                 'preview': str(art.getValue('title'))[1:81] + "..." if len(str(art.getValue('title'))) > 82
                 else str(art.getValue('title'))[1:-1]}
            )
        else:
            result[-1]['creator'] += "; " + str(art.getValue('creator_name'))[1:-1]
    return render_template("resources_search.html", results=result)
