# SYNTHEA : Multi-Agent Research Assistant

## Overview

Synthea is a fully autonomous AI system designed to act as a Multi-Agent Research Assistant. Instead of relying on a single AI to answer questions from memory, Synthea deploys a team of specialized, intelligent agents that collaborate to produce professional research reports on any given topic.

The system leverages Large Language Models (LLMs) connected through LangChain's modern LCEL pipeline and is orchestrated via a shared memory system, allowing the agents to operate as one unified brain. This production-level agentic AI architecture goes beyond simple Q&A tools to autonomously think, search, read, write, and review.

## System Architecture & Workflow

Below is the visual flow of the multi-agent pipeline:

```mermaid
graph TD
    %% Define Nodes (Main spine defined before Tools to keep Tools on the right)
    Topic["<b>You give a Research Topic</b>"]
    
    SearchAgent["First Agent<br><b>Search Agent</b><br>(AgentExecutor + web_search_tool)"]
    State1["<b>state['search result'] saved</b>"]
    Tool1["Tool 1<br><b>Tavily API - Live web results</b>"]
    
    ReaderAgent["Second Agent<br><b>Reader Agent</b><br>(AgentExecutor + scrape_url_tool)"]
    State2["<b>state['scraped content'] saved</b>"]
    Tool2["Tool 2<br><b>BeautifulSoup page content</b>"]
    
    WriterChain["<b>Writer chain</b>"]
    CriticChain["<b>Critic chain</b>"]
    
    Final["<b>Final output</b>"]
    
    %% Connections (Main flow declared first so Tools branch to the right)
    Topic --> SearchAgent
    
    SearchAgent --> State1
    SearchAgent -->|Fetching real time data| Tool1
    Tool1 --> SearchAgent
    
    State1 --> ReaderAgent
    
    ReaderAgent --> State2
    ReaderAgent -->|Fetching more information| Tool2
    Tool2 --> ReaderAgent
    
    %% Parallel Writer and Critic Chains
    State2 --> WriterChain
    State2 --> CriticChain
    
    WriterChain --> Final
    CriticChain --> Final
    
    %% Pastel Styling
    style Topic fill:#82e0aa,stroke:#27ae60,stroke-width:2px,color:#000
    style SearchAgent fill:#d7bde2,stroke:#8e44ad,stroke-width:2px,color:#000
    style Tool1 fill:#f5b7b1,stroke:#c0392b,stroke-width:2px,color:#000
    style State1 fill:#fad7a1,stroke:#d68910,stroke-width:2px,color:#000
    style ReaderAgent fill:#d7bde2,stroke:#8e44ad,stroke-width:2px,color:#000
    style Tool2 fill:#f5b7b1,stroke:#c0392b,stroke-width:2px,color:#000
    style State2 fill:#fad7a1,stroke:#d68910,stroke-width:2px,color:#000
    style WriterChain fill:#d5d8dc,stroke:#566573,stroke-width:2px,color:#000
    style CriticChain fill:#d5d8dc,stroke:#566573,stroke-width:2px,color:#000
    style Final fill:#82e0aa,stroke:#27ae60,stroke-width:2px,color:#000
```

### Pipeline Breakdown

The pipeline consists of four specialized agents/chains working in a continuous state-driven workflow:

#### 1. The Input

* **User Action:** You provide a specific **Research Topic**.

#### 2. Search Agent (First Agent)

* **Role:** Goes out on the live internet to find the most relevant and recent sources.
* **Components:** `AgentExecutor` + `web_search_tool`
* **Tools Used:** **Tavily API** (Fetches real-time, live web results).
* **State Update:** The findings are saved to `state['search result']`.

#### 3. Reader Agent (Second Agent)

* **Role:** Dives deep into the sources found by the Search Agent, scraping and extracting meaningful content.
* **Components:** `AgentExecutor` + `scrape_url_tool`
* **Tools Used:** **BeautifulSoup** (Scrapes webpage content).
* **State Update:** The extracted data is saved to `state['scraped content']`.

#### 4. Writer Chain

* **Role:** Takes all the gathered intelligence from the scraped content and crafts a well-structured, detailed report.

#### 5. Critic Chain

* **Role:** Acts as a senior researcher reviewing a junior's work. It reviews the entire report, scores it, and provides feedback to refine the final output.

#### 6. The Output

* **Final Delivery:** Both the Writer Chain and Critic Chain converge to produce a polished, comprehensive **Final output**.

## Tech Stack

* **Framework:** LangChain (LCEL Pipeline)
* **Core:** Large Language Models (LLMs)
* **Search Integration:** Tavily API
* **Web Scraping:** BeautifulSoup
* **Architecture:** State-driven shared memory system
