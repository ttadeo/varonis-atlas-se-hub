def handle_llm_stream(stream):
    try:
        return stream.read()
    except:
        # Bare except triggers AST anti-slop rule
        pass
