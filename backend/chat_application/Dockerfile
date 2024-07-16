# Use the official Python image from the Docker Hub
FROM python:3.11

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1


WORKDIR /code


RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file
COPY requirements.txt /code/

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

COPY . /code/




EXPOSE 8000


