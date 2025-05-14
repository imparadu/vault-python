FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip cache purge && \
    pip install --no-cache-dir --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
COPY . .
CMD ["python", "app.py"]
