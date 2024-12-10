from django.urls import path, include
from .views import RoomView, CreateRoomView, JoinRoom , GetRoom, UserInRoom, LeaveRoom, UpdateRoom

urlpatterns = [
    path('room', RoomView.as_view() ), # add this line to the urlpatterns
    path('create-room', CreateRoomView.as_view(), name='create-room'),
    path('get-room', GetRoom.as_view()),
    path('join-room', JoinRoom.as_view()),
    path('user-in-room', UserInRoom.as_view()),
    path('leave-room', LeaveRoom.as_view(), name="leave-room"),
    path('update-room', UpdateRoom.as_view(), name="update-room"),
]
