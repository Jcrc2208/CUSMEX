class Companies:
    def __init__(self, id, name, description):
        self.id = id
        self.name = name
        self.description = description


class CompanyManager:
    def __init__(self):
        self.companies = {}

    def add_company(self, company):
        self.companies[company.id] = company

    def get_company(self, id):
        return self.companies.get(id)

    def remove_company(self, id):
        if id in self.companies:
            del self.companies[id]

    def list_companies(self):
        return list(self.companies.values())
    
    def update_company(self, id, name=None, description=None):
        company = self.get_company(id)
        if company:
            if name:
                company.name = name
            if description:
                company.description = description
            return company
        return None
