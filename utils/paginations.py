from urllib.parse import urlencode
from django.http import QueryDict

from rest_framework.pagination import PageNumberPagination as PNP
from rest_framework.response import Response

class PageNumberPagination(PNP):
    page_size_query_param = 'page_size'
    page_size = 20

    def get_previous_link(self):
        if not self.page.has_previous():
            return None
        page_number = self.page.previous_page_number()
        
        # Copy the original query parameters to not alter the original request query_params
        request_params = self.request.GET.copy()
        request_params['page'] = page_number

        # Build the full URL with all original query parameters, altering only 'page'
        return self.request.build_absolute_uri('?{}'.format(urlencode(request_params)))

    def get_next_link(self):
        if not self.page.has_next():
            return None
        page_number = self.page.next_page_number()
        
        # Copy and modify the query parameters
        request_params = self.request.GET.copy()
        request_params['page'] = page_number
        
        # Build the URL
        return self.request.build_absolute_uri('?{}'.format(urlencode(request_params)))