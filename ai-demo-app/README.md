# Atlas Demo AI Application

A realistic AI application stack used to demonstrate Atlas AI Chain of Custody.

## Stack
- **LangChain** — orchestration framework
- **OpenAI GPT-4o** — primary LLM endpoint
- **Anthropic Claude** — secondary LLM
- **HuggingFace Transformers** — local model inference
- **ChromaDB / FAISS** — vector stores for RAG
- **Jupyter Notebooks** — data science workflows

## Use Case
Clinical note summarization for healthcare — demonstrates PII risk when
patient data flows through unmonitored LLM endpoints.

## Atlas Monitoring
This repository is connected to Atlas AI Inventory. Atlas automatically
discovers all AI libraries, model references, and data flows.
