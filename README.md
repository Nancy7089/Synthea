# SYNTHEA : Multi-Agent Research Assistant

## Overview

Synthea is a fully autonomous AI system designed to act as a Multi-Agent Research Assistant. Instead of relying on a single AI to answer questions from memory, Synthea deploys a team of specialized, intelligent agents that collaborate to produce professional research reports on any given topic.

The system leverages Large Language Models (LLMs) connected through LangChain's modern LCEL pipeline and is orchestrated via a shared memory system, allowing the agents to operate as one unified brain. This production-level agentic AI architecture goes beyond simple Q&A tools to autonomously think, search, read, write, and review.

## System Architecture & Workflow

Below is the visual flow of the multi-agent pipeline:

```mermaid
%%{init: {'flowchart': {'wrappingWidth': 400, 'htmlLabels': true}}}%%
flowchart TD
    %% Define Nodes (Clean text + extra padding spaces so boxes never clip text)
    Topic["&nbsp;&nbsp;You give a Research Topic&nbsp;&nbsp;"]
    
    SearchAgent["First Agent<br/>Search Agent<br/>(AgentExecutor +<br/>web_search_tool)"]
    State1["&nbsp;&nbsp;state['search result'] saved&nbsp;&nbsp;"]
    Tool1["Tool 1<br/>Tavily API - Live<br/>web results"]
    
    ReaderAgent["Second Agent<br/>Reader Agent<br/>(AgentExecutor +<br/>scrape_url_tool)"]
    State2["&nbsp;&nbsp;state['scraped content'] saved&nbsp;&nbsp;"]
    Tool2["Tool 2<br/>BeautifulSoup<br/>page content"]
    
    WriterChain["&nbsp;&nbsp;Writer chain&nbsp;&nbsp;"]
    CriticChain["&nbsp;&nbsp;Critic chain&nbsp;&nbsp;"]
    
    Final["&nbsp;&nbsp;Final output&nbsp;&nbsp;"]
    
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
    
    %% Custom Pastel Palette Styling
    %% Green (#D0F4DE), Purple (#E4C1F9), Pink (#FF99C8), Yellow (#FCF6BD), Blue (#A9DEF9)
    style Topic fill:#D0F4DE,stroke:#7bc49a,stroke-width:2px,color:#000
    style SearchAgent fill:#E4C1F9,stroke:#a87bc7,stroke-width:2px,color:#000
    style Tool1 fill:#FF99C8,stroke:#d45b92,stroke-width:2px,color:#000
    style State1 fill:#FCF6BD,stroke:#d4c86a,stroke-width:2px,color:#000
    style ReaderAgent fill:#E4C1F9,stroke:#a87bc7,stroke-width:2px,color:#000
    style Tool2 fill:#FF99C8,stroke:#d45b92,stroke-width:2px,color:#000
    style State2 fill:#FCF6BD,stroke:#d4c86a,stroke-width:2px,color:#000
    style WriterChain fill:#A9DEF9,stroke:#62a8cc,stroke-width:2px,color:#000
    style CriticChain fill:#A9DEF9,stroke:#62a8cc,stroke-width:2px,color:#000
    style Final fill:#D0F4DE,stroke:#7bc49a,stroke-width:2px,color:#000
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
