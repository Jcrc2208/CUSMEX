def get_company_info(company_id):
    company = CompanyService.get_company_by_id(company_id) # type: ignore
    if not company:
        return None
    return {
        "id": company.id,
        "name": company.name,
        "description": company.description,
        "dashboards": [Dashboard(d.id, d.name, d.description) for d in company.dashboards] # type: ignore
    }

