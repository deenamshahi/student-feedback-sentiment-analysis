FROM python:3.9-slim

WORKDIR /app

COPY . .

RUN pip install --upgrade pip && pip install -r requirements.txt

# Keep container alive for exec calls
CMD ["tail", "-f", "/dev/null"]
