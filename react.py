import http.server
import socketserver
import socket
import os
import glob

PORT = 80

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80)) 
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "Unable to get local IP"

def update_js_file(local_ip):
    js_files = glob.glob(os.path.join("assets", "*.js"))
    if not js_files:
        print("Error: No .js files found in assets folder")
        return None
    js_file_path = js_files[0]
    try:
        with open(js_file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        updated_content = content.replace("192.168.0.131", local_ip)
        
        with open(js_file_path, 'w', encoding='utf-8') as file:
            file.write(updated_content)
        print(f"Updated {js_file_path} with local IP: {local_ip}")
        return os.path.basename(js_file_path) 
    except UnicodeDecodeError as e:
        print(f"Error: Cannot decode {js_file_path} with UTF-8: {e}")
        return None
    except FileNotFoundError:
        print(f"Error: {js_file_path} not found")
        return None
    except Exception as e:
        print(f"Error updating JavaScript file: {e}")
        return None

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '':
            self.path = '/index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

Handler = CustomHandler

with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    ip = get_local_ip()
    update_js_file(ip)
    print(f"Serving at http://{ip}")
    httpd.serve_forever()