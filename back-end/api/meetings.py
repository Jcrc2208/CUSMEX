class meetings:
    def __init__(self):
        pass

def create_meeting(self, meeting_id, title, description, start_time, end_time):
    meeting = {
        "id": meeting_id,
        "title": title,
        "description": description,
        "start_time": start_time,
        "end_time": end_time
    }
    return meeting
    