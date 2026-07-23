class Assistant:
    def __init__(self, id, name, description):
        self.id = id
        self.name = name
        self.description = description

class AssistantManager:
    def __init__(self):
        self.assistants = {}

    def add_assistant(self, assistant):
        self.assistants[assistant.id] = assistant

    def get_assistant(self, id):
        return self.assistants.get(id)

    def remove_assistant(self, id):
        if id in self.assistants:
            del self.assistants[id]

def list_assistants(self):
    return list(self.assistants.values())
