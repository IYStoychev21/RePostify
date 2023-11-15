class Post:
    name: str
    _id: int
        
    def __init__(self, name: str, id: int):
        self.name = name
        self._id = id
    
    def get_post_name(self):
        print(f"Name == {self.name}")