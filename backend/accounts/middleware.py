from django.utils.deprecation import MiddlewareMixin
import logging
logger = logging.getLogger(__name__)

class CookieToAuthorizationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        access_token = request.COOKIES.get('access_token')
        logger.info(f"Access token from cookie: {access_token}")
        if access_token and 'HTTP_AUTHORIZATION' not in request.META:
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {access_token}'
            logger.info("Authorization header set from cookie")
        else:
            logger.info("No access token cookie or header already set")
