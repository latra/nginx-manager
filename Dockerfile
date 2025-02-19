FROM python:3.12

WORKDIR /app

COPY service/ .

RUN pip install -r requirements.txt

CMD ["fastapi", "run"]
