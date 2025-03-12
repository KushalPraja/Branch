#!/bin/bash
cd /home/site/wwwroot
gunicorn app:app --bind 0.0.0.0:8000 --workers 4 --worker-class uvicorn.workers.UvicornWorker
