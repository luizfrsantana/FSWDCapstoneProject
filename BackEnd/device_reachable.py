import socket

def is_device_reachable(host, port=22, timeout=3):

    try:
        with socket.create_connection((host, port), timeout):
            return True
    except (socket.timeout, socket.error):
        return False