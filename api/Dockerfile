# api/Dockerfile  
FROM python:3.10.6-slim

# Set working directory
WORKDIR /app

# Install system dependencies (minimal)
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Create wsgi.py
RUN echo "from excel_api import app\n\nif __name__ == '__main__':\n    app.run()" > wsgi.py

# Create necessary directories
RUN mkdir -p ../public/data ../public/images

# Expose port
EXPOSE 8000

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "2", "--timeout", "120", "excel_api:app"]