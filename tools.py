import os
from dotenv import load_dotenv
from tavily import TavilyClient
from langchain.tools import tool

load_dotenv()

tavily = TavilyClient(
    api_key=os.getenv("TAVILY_API_KEY")
)


@tool
def web_search(query: str) -> str:
    """Search the web and return formatted results with titles, URLs and snippets."""

    results = tavily.search(
        query=query,
        max_results=5
    )

    out = []

    for i, r in enumerate(results["results"], start=1):
        out.append(
            f"Result {i}\n"
            f"Title: {r['title']}\n"
            f"URL: {r['url']}\n"
            f"Snippet: {r['content'][:300]}\n"
        )

    return "\n-------------------------\n".join(out)


print(web_search.invoke("What are the recent news updates about AI?"))
