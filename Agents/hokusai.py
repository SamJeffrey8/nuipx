from crewai import Agent, Task, Crew, Process, LLM
from crewai.knowledge.source.base_knowledge_source import BaseKnowledgeSource
import requests
from datetime import datetime
from typing import Dict, Any
from pydantic import BaseModel, Field
from crewai_tools import VisionTool

from typing import Type
from crewai.tools import BaseTool


class MyCustomTool(BaseTool):
    name: str = "Hokusai Image Picker"
    description: str = "This tooks picks hokusai image from the data library and returns url"

    def _run(self, argument: str) -> str:

        response = requests.get(
            f"http://localhost:8000/Katsushika-Hokusai-Agent/",
            headers={
                "X-API-Key": "TEST"
            }
        )

        response.raise_for_status()

        import base64

        # Convert the image data to base64
        data = base64.b64encode(response.content).decode('utf-8')
                
        # Define the parameters for the image upload
        params = {
            # Replace with actual API key if needed
            "key": "45d7183c6ccf4657748c53ac9ffc842a",
            "image": data
        }

        # Make the request to upload the image
        upload_response = requests.post(
            "https://api.imgbb.com/1/upload",  # Replace with actual upload endpoint
            data=params
        )
        
        print(upload_response.status_code)

        return upload_response.json().get('data').get("url")


vision_tool = VisionTool()


class SpaceNewsKnowledgeSource(BaseKnowledgeSource):
    """Knowledge source that fetches data from Space News API."""

    api_endpoint: str = Field(description="API endpoint URL")
    limit: int = Field(default=10, description="Number of articles to fetch")

    def load_content(self) -> Dict[Any, str]:
        """Fetch and format space news articles."""
        try:
            response = requests.get(
                f"{self.api_endpoint}",
                headers={
                    "X-API-Key": "TEST"
                }
            )
            response.raise_for_status()

            data = response.json()

            print(data)

            formatted_data = self._format_report(data)
            return {self.api_endpoint: formatted_data}
        except Exception as e:
            raise ValueError(f"Failed to fetch space news: {str(e)}")

    def _format_report(self, report) -> str:
        """Format the structured report into a readable text format."""
        formatted = f"""
        Title: {report['title']}
        
        Introduction:
        {report['introduction']['text']}
        
        Sections:
        """

        for section in report['sections']:
            formatted += f"\n    {section['title']}\n"

            for subsection in section.get('subsections', []):
                formatted += f"\n        {subsection['title']}\n"

                for point in subsection.get('points', []):
                    formatted += f"\n            - {point['topic']}: {point['details']}\n"

        formatted += "\n    Conclusion:\n    " + \
            report['sections'][-1]['text'] + "\n"

        formatted += "\n    References:\n"
        for reference in report['references']:
            formatted += f"    - {reference}\n"

        return formatted

    def add(self) -> None:
        """Process and store the articles."""
        content = self.load_content()
        for _, text in content.items():
            chunks = self._chunk_text(text)
            self.chunks.extend(chunks)

        self._save_documents()

    def validate_content(self) -> bool:
        """Validate the content fetched from the API."""
        return True


# Create knowledge source
recent_news = SpaceNewsKnowledgeSource(
    api_endpoint="http://localhost:8000/nuclear-desci-agent/",
    limit=10,
)
hokusai_tool = MyCustomTool()

# Create specialized agent
space_analyst = Agent(
    role="Hokusai Assistant",
    goal="Match the vibe of user query, pick hokusai image and analyse the image with vision tool, explain the image with vibe of user query",
    backstory="""You are hokusai assistant who picks hokusai image and analyse, keep the user engaging with dynamic attitude""",
    llm=LLM(model="gpt-4", temperature=0.0),
    tools=[vision_tool, hokusai_tool]
)


# Create task that handles user questions
analysis_task = Task(
    description="Answer this question: {user_question}",
    expected_output="Match the vibe of user query, pick hokusai image and analyse the image with vision tool, explain the image with vibe of user query",
    agent=space_analyst,
)

# Create and run the crew
crew = Crew(
    agents=[space_analyst],
    tasks=[analysis_task],
    verbose=True,
    process=Process.sequential
)

# Example usage
result = crew.kickoff(
    inputs={"user_question": "I'm feeling tired"}
)
