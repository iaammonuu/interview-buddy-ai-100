import type { CurriculumDay } from "@/types/interview";

/**
 * REAL COHORT CURRICULUM.
 * Source: curriculum.json supplied with the brief ("AI Cohort · 31 days · 8 modules").
 */
export const cohortName = "AI Cohort \u00b7 31 days \u00b7 8 modules";

export const curriculum: CurriculumDay[] = [
  {
    "day": 1,
    "module": "1. Environment & Tooling",
    "title": "VS Code & Python Environment Setup",
    "type": "SETUP",
    "topics": [
      "Install VS Code and Python on your machine",
      "Configure the Python extension and Pylance",
      "and activate a project virtual environment (.venv)",
      "Run and debug your first Python program inside VS Code"
    ],
    "objectives": [
      "Install VS Code and Python on your machine",
      "Configure the Python extension and Pylance",
      "Create and activate a project virtual environment (.venv)",
      "Run and debug your first Python program inside VS Code",
      "Verify the development environment is ready for the remaining course"
    ],
    "tools": [
      "VS Code",
      "Python",
      "Python Extension",
      "Pylance",
      "Virtual Environment"
    ]
  },
  {
    "day": 2,
    "module": "1. Environment & Tooling",
    "title": "Local LLM & AI Coding Assistant Setup",
    "type": "SETUP",
    "topics": [
      "Install Ollama and download a local coding model",
      "Verify the local model works through the Ollama CLI",
      "Connect VS Code to the local model",
      "Generate code"
    ],
    "objectives": [
      "Install Ollama and download a local coding model",
      "Verify the local model works through the Ollama CLI",
      "Connect VS Code to the local model using GitHub Copilot or Cline",
      "Generate code using the local AI assistant",
      "Confirm the complete AI coding workflow works offline"
    ],
    "tools": [
      "Ollama",
      "Qwen2.5-Coder",
      "GitHub Copilot",
      "Cline"
    ]
  },
  {
    "day": 3,
    "module": "1. Environment & Tooling",
    "title": "First AI Project, React Frontend & GitHub",
    "type": "BUILD",
    "topics": [
      "a command-line chatbot powered by your local Ollama model",
      "Scaffold a FastAPI backend with a health endpoint",
      "a React application",
      "Connect the React frontend with the FastAPI backend"
    ],
    "objectives": [
      "Build a command-line chatbot powered by your local Ollama model",
      "Scaffold a FastAPI backend with a health endpoint",
      "Create a React application using Vite",
      "Connect the React frontend with the FastAPI backend",
      "Initialize Git, commit the project, and publish it to GitHub"
    ],
    "tools": [
      "Python",
      "Ollama",
      "FastAPI",
      "React",
      "Vite",
      "Git",
      "GitHub"
    ]
  },
  {
    "day": 4,
    "module": "2. Data Foundations",
    "title": "Reading & Processing Structured Data",
    "type": "BUILD",
    "topics": [
      "synthetic healthcare plans and claims datasets",
      "Load and clean structured CSV data",
      "Store the processed data in a SQLite database",
      "Write SQL queries to answer common healthcare questions"
    ],
    "objectives": [
      "Create synthetic healthcare plans and claims datasets",
      "Load and clean structured CSV data using Pandas",
      "Store the processed data in a SQLite database",
      "Write SQL queries to answer common healthcare questions",
      "Document reusable SQL queries for later chatbot integration"
    ],
    "tools": [
      "Pandas",
      "SQLite",
      "SQL",
      "SQLAlchemy"
    ]
  },
  {
    "day": 5,
    "module": "2. Data Foundations",
    "title": "Reading & Processing Unstructured Data",
    "type": "BUILD",
    "topics": [
      "Extract text from healthcare PDFs and Word documents",
      "Perform OCR on scanned enrollment forms",
      "Scrape useful content from a public healthcare webpage",
      "Clean and normalize extracted text from multiple sources"
    ],
    "objectives": [
      "Extract text from healthcare PDFs and Word documents",
      "Perform OCR on scanned enrollment forms",
      "Scrape useful content from a public healthcare webpage",
      "Clean and normalize extracted text from multiple sources",
      "Store the processed text files for knowledge-base creation"
    ],
    "tools": [
      "pdfplumber",
      "PyPDF",
      "python-docx",
      "Tesseract OCR",
      "BeautifulSoup",
      "Requests"
    ]
  },
  {
    "day": 6,
    "module": "2. Data Foundations",
    "title": "Building the Knowledge Base",
    "type": "BUILD",
    "topics": [
      "Convert structured and unstructured healthcare data into a unified knowledge base",
      "Split long documents into retrieval-friendly chunks",
      "Attach metadata such as source, plan type, and document section to every chunk",
      "Export all processed records into a knowledge_base.jsonl file"
    ],
    "objectives": [
      "Convert structured and unstructured healthcare data into a unified knowledge base",
      "Split long documents into retrieval-friendly chunks",
      "Attach metadata such as source, plan type, and document section to every chunk",
      "Export all processed records into a knowledge_base.jsonl file",
      "Validate chunk quality before using them for embeddings"
    ],
    "tools": [
      "LangChain Text Splitters",
      "JSONL",
      "Python"
    ]
  },
  {
    "day": 7,
    "module": "3. Embeddings & Vector Search",
    "title": "Embeddings Explained",
    "type": "AI_CORE",
    "topics": [
      "how text is converted into vector embeddings",
      "Generate embeddings for every knowledge base chunk",
      "Store embeddings alongside the original documents",
      "Visualize embedding clusters"
    ],
    "objectives": [
      "Understand how text is converted into vector embeddings",
      "Generate embeddings for every knowledge base chunk",
      "Store embeddings alongside the original documents",
      "Visualize embedding clusters using PCA",
      "Analyze whether similar healthcare concepts cluster together"
    ],
    "tools": [
      "Sentence Transformers",
      "OpenAI Embeddings",
      "Scikit-learn",
      "Matplotlib"
    ]
  },
  {
    "day": 8,
    "module": "3. Embeddings & Vector Search",
    "title": "Vector Databases Overview",
    "type": "BUILD",
    "topics": [
      "Learn the role of vector databases in RAG applications",
      "Set up a local Chroma vector database",
      "a cloud-based Pinecone index for comparison",
      "Compare local and managed vector database solutions"
    ],
    "objectives": [
      "Learn the role of vector databases in RAG applications",
      "Set up a local Chroma vector database",
      "Create a cloud-based Pinecone index for comparison",
      "Compare local and managed vector database solutions",
      "Select the most suitable database for the chatbot project"
    ],
    "tools": [
      "ChromaDB",
      "Pinecone"
    ]
  },
  {
    "day": 9,
    "module": "3. Embeddings & Vector Search",
    "title": "Building & Populating the Vector Database",
    "type": "BUILD",
    "topics": [
      "Load knowledge base embeddings into the vector database",
      "Store documents together with metadata for filtering",
      "Verify that every knowledge base chunk has been indexed",
      "Test semantic search with healthcare-related questions"
    ],
    "objectives": [
      "Load knowledge base embeddings into the vector database",
      "Store documents together with metadata for filtering",
      "Verify that every knowledge base chunk has been indexed",
      "Test semantic search with healthcare-related questions",
      "Evaluate retrieval quality and metadata filtering"
    ],
    "tools": [
      "ChromaDB",
      "Sentence Transformers"
    ]
  },
  {
    "day": 10,
    "module": "3. Embeddings & Vector Search",
    "title": "The Retrieval & Matching Engine",
    "type": "SHIP_IT",
    "topics": [
      "a query router that decides between SQL, vector search, or hybrid retrieval",
      "Implement structured data lookup for plans and claims",
      "Implement semantic retrieval from the vector database",
      "Merge and deduplicate results from multiple retrieval sources"
    ],
    "objectives": [
      "Build a query router that decides between SQL, vector search, or hybrid retrieval",
      "Implement structured data lookup for plans and claims",
      "Implement semantic retrieval from the vector database",
      "Merge and deduplicate results from multiple retrieval sources",
      "Evaluate retrieval accuracy using a diverse set of healthcare questions"
    ],
    "tools": [
      "SQLite",
      "ChromaDB",
      "Python"
    ]
  },
  {
    "day": 11,
    "module": "4. LLM Core, Prompting & Fine-Tuning",
    "title": "RAG End-to-End & LLM API Basics",
    "type": "BUILD",
    "topics": [
      "Connect the retrieval engine to an LLM to build a complete RAG pipeline",
      "Configure a local or hosted LLM provider",
      "a grounded prompt that answers only from retrieved context",
      "Generate answers"
    ],
    "objectives": [
      "Connect the retrieval engine to an LLM to build a complete RAG pipeline",
      "Configure a local or hosted LLM provider using the OpenAI-compatible SDK",
      "Create a grounded prompt that answers only from retrieved context",
      "Generate answers using retrieved knowledge",
      "Evaluate chatbot responses against the retrieval-only baseline"
    ],
    "tools": [
      "OpenAI SDK",
      "Ollama",
      "Groq",
      "Python"
    ]
  },
  {
    "day": 12,
    "module": "4. LLM Core, Prompting & Fine-Tuning",
    "title": "Prompt Engineering Fundamentals",
    "type": "LEARN",
    "topics": [
      "zero-shot, few-shot, and chain-of-thought prompting",
      "Design multiple system prompt variations for the chatbot",
      "Compare prompts based on accuracy, compliance, and tone",
      "Evaluate prompt performance"
    ],
    "objectives": [
      "Understand zero-shot, few-shot, and chain-of-thought prompting",
      "Design multiple system prompt variations for the chatbot",
      "Compare prompts based on accuracy, compliance, and tone",
      "Evaluate prompt performance using a fixed question set",
      "Finalize the production-ready system prompt"
    ],
    "tools": [
      "LLMs",
      "Prompt Templates"
    ]
  },
  {
    "day": 13,
    "module": "4. LLM Core, Prompting & Fine-Tuning",
    "title": "Advanced Prompting: Function Calling & Structured Outputs",
    "type": "BUILD",
    "topics": [
      "Define tool schemas for healthcare-related chatbot functions",
      "Implement LLM function calling with automatic tool execution",
      "Validate structured outputs",
      "Log tool calls for debugging and auditing"
    ],
    "objectives": [
      "Define tool schemas for healthcare-related chatbot functions",
      "Implement LLM function calling with automatic tool execution",
      "Validate structured outputs using Pydantic models",
      "Log tool calls for debugging and auditing",
      "Test different user queries to verify correct tool selection"
    ],
    "tools": [
      "OpenAI Function Calling",
      "Pydantic",
      "Python"
    ]
  },
  {
    "day": 14,
    "module": "4. LLM Core, Prompting & Fine-Tuning",
    "title": "Fine-Tuning: Concepts & When to Use It",
    "type": "LEARN",
    "topics": [
      "when fine-tuning is more appropriate than prompting or RAG",
      "Identify chatbot issues that fine-tuning can solve",
      "a high-quality fine-tuning dataset",
      "Validate and organize the dataset into training and test sets"
    ],
    "objectives": [
      "Understand when fine-tuning is more appropriate than prompting or RAG",
      "Identify chatbot issues that fine-tuning can solve",
      "Create a high-quality fine-tuning dataset",
      "Validate and organize the dataset into training and test sets",
      "Prepare the project for model fine-tuning"
    ],
    "tools": [
      "JSONL",
      "OpenAI",
      "LoRA",
      "QLoRA"
    ]
  },
  {
    "day": 15,
    "module": "4. LLM Core, Prompting & Fine-Tuning",
    "title": "Fine-Tuning: Hands-On with LoRA & QLoRA",
    "type": "SHIP_IT",
    "topics": [
      "Train or fine-tune an LLM",
      "Load and evaluate the fine-tuned model",
      "Compare the base model and fine-tuned model on unseen test cases",
      "Measure improvements in tone, consistency, and response quality"
    ],
    "objectives": [
      "Train or fine-tune an LLM using LoRA or the OpenAI fine-tuning workflow",
      "Load and evaluate the fine-tuned model",
      "Compare the base model and fine-tuned model on unseen test cases",
      "Measure improvements in tone, consistency, and response quality",
      "Document whether fine-tuning provides measurable benefits for the chatbot"
    ],
    "tools": [
      "PEFT",
      "Transformers",
      "BitsAndBytes",
      "OpenAI Fine-Tuning",
      "LoRA"
    ]
  },
  {
    "day": 16,
    "module": "5. Chatbot Application Build",
    "title": "Chatbot Backend & API Integration",
    "type": "BUILD",
    "topics": [
      "a /chat API endpoint for the healthcare chatbot",
      "Integrate retrieval, function calling, and LLM response generation",
      "Implement session-based conversation management",
      "a conversation history endpoint"
    ],
    "objectives": [
      "Create a /chat API endpoint for the healthcare chatbot",
      "Integrate retrieval, function calling, and LLM response generation",
      "Implement session-based conversation management",
      "Build a conversation history endpoint",
      "Test the complete backend API using Postman or cURL"
    ],
    "tools": [
      "FastAPI",
      "SQLite",
      "Python"
    ]
  },
  {
    "day": 17,
    "module": "5. Chatbot Application Build",
    "title": "Chatbot Frontend Development",
    "type": "BUILD",
    "topics": [
      "an interactive chat interface for the chatbot",
      "Connect the frontend to the backend chat API",
      "Maintain conversation history across user interactions",
      "Add a healthcare plan selector and new conversation option"
    ],
    "objectives": [
      "Build an interactive chat interface for the chatbot",
      "Connect the frontend to the backend chat API",
      "Maintain conversation history across user interactions",
      "Add a healthcare plan selector and new conversation option",
      "Validate end-to-end communication between frontend and backend"
    ],
    "tools": [
      "Streamlit",
      "Requests",
      "UUID"
    ]
  },
  {
    "day": 18,
    "module": "5. Chatbot Application Build",
    "title": "Full-Stack Integration & Streaming Responses",
    "type": "BUILD",
    "topics": [
      "Implement real-time streaming responses from the LLM",
      "Display generated tokens incrementally in the chat interface",
      "Add loading indicators for a better user experience",
      "Handle interrupted or failed streaming requests gracefully"
    ],
    "objectives": [
      "Implement real-time streaming responses from the LLM",
      "Display generated tokens incrementally in the chat interface",
      "Add loading indicators for a better user experience",
      "Handle interrupted or failed streaming requests gracefully",
      "Verify smooth end-to-end streaming between backend and frontend"
    ],
    "tools": [
      "FastAPI",
      "StreamingResponse",
      "Server-Sent Events",
      "Streamlit"
    ]
  },
  {
    "day": 19,
    "module": "5. Chatbot Application Build",
    "title": "Response Formatting & Rich Outputs",
    "type": "BUILD",
    "topics": [
      "Add citations to chatbot responses",
      "structured cards for claims and coverage summaries",
      "Render Markdown content with tables, lists, and formatting",
      "Validate structured outputs before displaying them"
    ],
    "objectives": [
      "Add citations to chatbot responses using retrieved knowledge",
      "Create structured cards for claims and coverage summaries",
      "Render Markdown content with tables, lists, and formatting",
      "Validate structured outputs before displaying them",
      "Improve chatbot readability and response trustworthiness"
    ],
    "tools": [
      "Pydantic",
      "Markdown",
      "Streamlit"
    ]
  },
  {
    "day": 20,
    "module": "5. Chatbot Application Build",
    "title": "Conversation Memory & Context Management",
    "type": "SHIP_IT",
    "topics": [
      "Persist conversation history across multiple user sessions",
      "context-aware conversations",
      "Implement automatic conversation summarization for long chats",
      "Manage token limits while preserving important context"
    ],
    "objectives": [
      "Persist conversation history across multiple user sessions",
      "Build context-aware conversations using previous messages",
      "Implement automatic conversation summarization for long chats",
      "Manage token limits while preserving important context",
      "Ensure the chatbot remembers user preferences throughout a conversation"
    ],
    "tools": [
      "SQLite",
      "FastAPI",
      "LLM",
      "Token Management"
    ]
  },
  {
    "day": 21,
    "module": "6. Agentic AI & MCP",
    "title": "Agentic Frameworks: LangChain Agents & Tool Use",
    "type": "BUILD",
    "topics": [
      "Convert function-calling workflows into a reasoning agent",
      "Wrap chatbot capabilities as reusable LangChain tools",
      "a ReAct agent capable of selecting the correct tool automatically",
      "Analyze reasoning traces to understand agent decision making"
    ],
    "objectives": [
      "Convert function-calling workflows into a reasoning agent",
      "Wrap chatbot capabilities as reusable LangChain tools",
      "Build a ReAct agent capable of selecting the correct tool automatically",
      "Analyze reasoning traces to understand agent decision making",
      "Evaluate whether the agent chooses the right tools for healthcare queries"
    ],
    "tools": [
      "LangChain",
      "LangChain Agents",
      "ReAct",
      "Python"
    ]
  },
  {
    "day": 22,
    "module": "6. Agentic AI & MCP",
    "title": "Multi-Agent Orchestration",
    "type": "BUILD",
    "topics": [
      "specialized agents for different healthcare domains",
      "a router agent that delegates requests to the correct specialist",
      "Implement a complete multi-agent workflow",
      "Compare multi-agent performance with a single-agent architecture"
    ],
    "objectives": [
      "Create specialized agents for different healthcare domains",
      "Build a router agent that delegates requests to the correct specialist",
      "Implement a complete multi-agent workflow",
      "Compare multi-agent performance with a single-agent architecture",
      "Identify scenarios where multiple agents provide measurable benefits"
    ],
    "tools": [
      "CrewAI",
      "LangGraph",
      "Python"
    ]
  },
  {
    "day": 23,
    "module": "6. Agentic AI & MCP",
    "title": "Model Context Protocol (MCP)",
    "type": "BUILD",
    "topics": [
      "the purpose of the Model Context Protocol",
      "an MCP server exposing healthcare chatbot tools",
      "Connect the MCP server to an MCP-compatible client",
      "Expose multiple chatbot capabilities through standardized MCP tools"
    ],
    "objectives": [
      "Understand the purpose of the Model Context Protocol",
      "Build an MCP server exposing healthcare chatbot tools",
      "Connect the MCP server to an MCP-compatible client",
      "Expose multiple chatbot capabilities through standardized MCP tools",
      "Verify successful tool execution through live MCP interactions"
    ],
    "tools": [
      "MCP Python SDK",
      "Claude Desktop",
      "Cline",
      "Python"
    ]
  },
  {
    "day": 24,
    "module": "6. Agentic AI & MCP",
    "title": "Agentic Chatbot Integration",
    "type": "SHIP_IT",
    "topics": [
      "Integrate agents, MCP tools, retrieval, and conversation memory",
      "Replace mock tools with live MCP-powered tool calls",
      "Implement retries, timeouts, and graceful error handling",
      "Perform failure testing to validate chatbot reliability"
    ],
    "objectives": [
      "Integrate agents, MCP tools, retrieval, and conversation memory",
      "Replace mock tools with live MCP-powered tool calls",
      "Implement retries, timeouts, and graceful error handling",
      "Perform failure testing to validate chatbot reliability",
      "Build a production-style agentic chatbot pipeline"
    ],
    "tools": [
      "LangChain",
      "MCP",
      "FastAPI",
      "Python"
    ]
  },
  {
    "day": 25,
    "module": "7. Evaluation, Security & Deployment",
    "title": "Chatbot Evaluation & Testing",
    "type": "SHIP_IT",
    "topics": [
      "a benchmark dataset covering representative healthcare questions",
      "Evaluate chatbot responses for accuracy, grounding, and consistency",
      "Measure retrieval quality and end-to-end response performance",
      "Identify common failure cases and document improvement areas"
    ],
    "objectives": [
      "Create a benchmark dataset covering representative healthcare questions",
      "Evaluate chatbot responses for accuracy, grounding, and consistency",
      "Measure retrieval quality and end-to-end response performance",
      "Identify common failure cases and document improvement areas",
      "Establish baseline metrics before production deployment"
    ],
    "tools": [
      "Python",
      "Evaluation Dataset",
      "Automated Testing"
    ]
  },
  {
    "day": 26,
    "module": "7. Evaluation, Security & Deployment",
    "title": "Performance Optimization & Cost Management",
    "type": "OPTIMIZE",
    "topics": [
      "Measure token usage across the chatbot pipeline",
      "Optimize retrieval and prompt size to reduce latency and cost",
      "Implement response caching for repeated queries",
      "Benchmark response time before and after optimization"
    ],
    "objectives": [
      "Measure token usage across the chatbot pipeline",
      "Optimize retrieval and prompt size to reduce latency and cost",
      "Implement response caching for repeated queries",
      "Benchmark response time before and after optimization",
      "Document performance improvements using measurable metrics"
    ],
    "tools": [
      "tiktoken",
      "Python",
      "FastAPI"
    ]
  },
  {
    "day": 27,
    "module": "7. Evaluation, Security & Deployment",
    "title": "Security, Privacy & Guardrails",
    "type": "BUILD",
    "topics": [
      "Secure chatbot APIs against unauthorized access",
      "Validate and sanitize user inputs before processing",
      "Protect sensitive healthcare information throughout the pipeline",
      "Implement prompt-injection and jailbreak safeguards"
    ],
    "objectives": [
      "Secure chatbot APIs against unauthorized access",
      "Validate and sanitize user inputs before processing",
      "Protect sensitive healthcare information throughout the pipeline",
      "Implement prompt-injection and jailbreak safeguards",
      "Test common security scenarios and document mitigation strategies"
    ],
    "tools": [
      "FastAPI",
      "Python",
      "Authentication",
      "Input Validation"
    ]
  },
  {
    "day": 28,
    "module": "7. Evaluation, Security & Deployment",
    "title": "Docker & Kubernetes Deployment",
    "type": "SHIP_IT",
    "topics": [
      "Containerize the chatbot backend and frontend",
      "Deploy the application to a Kubernetes cluster",
      "Configure health checks and environment variables",
      "Verify the deployed chatbot functions correctly"
    ],
    "objectives": [
      "Containerize the chatbot backend and frontend using Docker",
      "Deploy the application to a Kubernetes cluster",
      "Configure health checks and environment variables",
      "Verify the deployed chatbot functions correctly",
      "Prepare the application for production hosting"
    ],
    "tools": [
      "Docker",
      "Kubernetes",
      "FastAPI",
      "React"
    ]
  },
  {
    "day": 29,
    "module": "8. Production & Capstone",
    "title": "Monitoring, Logging & Observability",
    "type": "BUILD",
    "topics": [
      "Add structured logging throughout the chatbot pipeline",
      "Monitor API performance and chatbot usage",
      "Track failures, latency, and tool execution metrics",
      "dashboards for production observability"
    ],
    "objectives": [
      "Add structured logging throughout the chatbot pipeline",
      "Monitor API performance and chatbot usage",
      "Track failures, latency, and tool execution metrics",
      "Build dashboards for production observability",
      "Use monitoring insights to improve chatbot reliability"
    ],
    "tools": [
      "Python Logging",
      "Prometheus",
      "Grafana"
    ]
  },
  {
    "day": 30,
    "module": "8. Production & Capstone",
    "title": "Production Readiness & Final Testing",
    "type": "SHIP_IT",
    "topics": [
      "Perform complete end-to-end testing of the chatbot",
      "Validate retrieval, agent workflows, and frontend integration",
      "Fix production issues discovered during testing",
      "Complete deployment and operational documentation"
    ],
    "objectives": [
      "Perform complete end-to-end testing of the chatbot",
      "Validate retrieval, agent workflows, and frontend integration",
      "Fix production issues discovered during testing",
      "Complete deployment and operational documentation",
      "Prepare the chatbot for real-world production usage"
    ],
    "tools": [
      "FastAPI",
      "Docker",
      "Kubernetes",
      "Python"
    ]
  },
  {
    "day": 31,
    "module": "8. Production & Capstone",
    "title": "Capstone Project & Final Demo",
    "type": "CAPSTONE",
    "topics": [
      "Demonstrate the complete enterprise healthcare chatbot",
      "Showcase retrieval, RAG, agents, MCP, and conversation memory",
      "Present the deployed application with production architecture",
      "Evaluate the chatbot"
    ],
    "objectives": [
      "Demonstrate the complete enterprise healthcare chatbot",
      "Showcase retrieval, RAG, agents, MCP, and conversation memory",
      "Present the deployed application with production architecture",
      "Evaluate the chatbot using real-world scenarios",
      "Publish the final project with source code and documentation"
    ],
    "tools": [
      "FastAPI",
      "React",
      "LangChain",
      "MCP",
      "Docker",
      "Kubernetes"
    ]
  }
];

export const curriculumByDay = new Map(curriculum.map((d) => [d.day, d]));

export function getDay(day: number): CurriculumDay {
  return curriculumByDay.get(day) ?? curriculum[0]!;
}
