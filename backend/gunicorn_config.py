import multiprocessing

# Gunicorn configuration file
bind = "0.0.0.0:8000"  # The host:port Gunicorn will listen on
workers = multiprocessing.cpu_count() * 2 + 1  # Number of worker processes
worker_class = "sync"  # Type of worker processes
timeout = 120  # Timeout for worker processes
keepalive = 5  # The number of seconds to wait for requests on a Keep-Alive connection
max_requests = 1000  # Restart workers after this many requests
max_requests_jitter = 50  # Add randomness to max_requests
reload = False  # Reload code on change (development only, set to False in production)
accesslog = "-"  # Log to stdout
errorlog = "-"  # Log to stderr
loglevel = "info"
