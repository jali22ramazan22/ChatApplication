
FROM python:latest as dev-stage

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1


WORKDIR /dev-code

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /dev-code/
RUN pip install --upgrade pip && \
    pip install -r requirements.txt


COPY . /dev-code/


EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]