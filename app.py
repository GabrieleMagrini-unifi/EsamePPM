from flask import Flask, render_template, request

app = Flask(__name__)


def execute_query(query: str):
    return []


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/resources", methods=['GET', 'POST'])
def resources_search_result():
    # dizioniario roba get
    sparql_query_elements = request.values
    query = ""
    query_results = execute_query(query)
    return render_template("resources_search.html", query_results)
