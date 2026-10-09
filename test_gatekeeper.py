def process_agent_response(response):
    try:
        return response["output"]
    except:
        pass
