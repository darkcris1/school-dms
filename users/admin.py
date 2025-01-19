from django.contrib import admin
from .models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Register your models here.
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ('email',)
    list_filter = ('is_active', 'is_superuser',)
    search_fields = ("first_name", "last_name", "email")

    filter_horizontal = ('groups', 'user_permissions')
    list_display = (
        'email',
        'first_name',
        'last_name',
        'created_at',
        'last_login',
        'is_active',
    )

    fieldsets = (
        ("Account", {
            'fields': ('email', 'password',),
        }),
        ("Basic Information", {
            'fields': ('first_name', 'last_name',)
        }),
        ("Others", {
            'fields': ('groups', 'user_permissions','is_active', 'is_staff', 'is_superuser')
        })
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )