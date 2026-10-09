def process_payload(data):
    try:
        return data["token"]
    except:
        pass
