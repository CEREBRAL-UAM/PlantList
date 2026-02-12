import threading
import time
import os 
import serial
from serial.tools import list_ports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

ARDUINO_PORT = "COM5" 
BAUD_RATE = 9600

serial_conn = None
latest_value = None
running = True

def puertos():
    # Ver puertos disponibles 
    print("Puertos serie detectados:")
    for p in list_ports.comports():
        print(f"- {p.device} | {p.description} | {p.manufacturer}")

# Abrir el puerto indicado en ARDUINO_PORT
def conectarSerial():
    global serial_conn
    puertos() # Imprime lo que ve la máquina

    try:
        serial_conn = serial.Serial(ARDUINO_PORT, BAUD_RATE, timeout=1)
        print(f"Conectado a {ARDUINO_PORT} a {BAUD_RATE} bps.")
    except Exception as e:
        print(f"No se pudo abrir el puerto {ARDUINO_PORT}:", e)
        serial_conn = None


def leerSerial():
    global latest_value, serial_conn, running

    while running:
        if serial_conn is None or not serial_conn.is_open:
            conectarSerial()
            time.sleep(2)
            continue

        try:
            line = serial_conn.readline().decode("utf-8", errors="ignore").strip()
            if line:
                try:
                    value = int(line)
                    latest_value = value
                    print("Arduino:", value)
                except ValueError:
                    print("Dato no recibido:", line)
        except Exception as e:
            print("Error leyendo del puerto serial:", e)
            try:
                serial_conn.close()
            except Exception:
                pass
            serial_conn = None
            time.sleep(2)

thread = threading.Thread(target=leerSerial, daemon=True)
thread.start()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/sensor")
def get_humedad():
    # Devuelve ultimo valor leido
    return {
        "sensor": "humedad",
        "value": latest_value,
        "ts": time.time(),
    }
