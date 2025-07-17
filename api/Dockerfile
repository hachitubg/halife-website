# api/Dockerfile  
FROM python:3.10.6-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip first
RUN pip install --upgrade pip

# Install exact versions from your local environment
RUN pip install --no-cache-dir numpy==1.26.4
RUN pip install --no-cache-dir pandas==2.1.4
RUN pip install --no-cache-dir openpyxl==3.1.2
RUN pip install --no-cache-dir flask==3.0.0
RUN pip install --no-cache-dir flask-cors==4.0.0
RUN pip install --no-cache-dir gunicorn

# Copy source code
COPY . .

# Create wsgi.py
RUN echo "from excel_api import app\n\nif __name__ == '__main__':\n    app.run()" > wsgi.py

# Expose port
EXPOSE 8000

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "excel_api:app"]