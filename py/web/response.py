from pydantic import BaseModel
from typing import TypeVar

# class Response:
#     """
#     自訂的回應類別
#     """
#
#     def __new__(cls, status, message='', data=None):
#         instance = super(Response, cls).__new__(cls)
#         instance.status = status
#         instance.message = message
#         instance.data = data
#         return instance.to_dict()
#
#     def to_dict(self):
#         return {
#             'status': self.status,
#             'message': self.message,
#             'data': self.data,
#         }


T = TypeVar('T')


class Response(BaseModel[T]):
    status: int
    message: str = ''
    data: T | None = None
