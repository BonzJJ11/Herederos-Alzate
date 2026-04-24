from django.contrib import admin
from .models import Usuario, Rol, Movimiento, TipoMovimiento, Calzado, Categoria, Proveedor

# Register your models here.
# ============================================================
# ROL
# ============================================================
@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display  = ('id_rol', 'nombre_rol', 'descripcion')
    search_fields = ('nombre_rol',)
    ordering      = ('nombre_rol',)


# ============================================================
# USUARIO
# ============================================================
@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display   = ('id_usuario', 'usuario', 'nombre', 'apellidos', 'identificacion',
                      'mail', 'fecha_ingreso', 'ultimo_acceso', 'id_rol', 'activo')
    search_fields  = ('usuario', 'nombre', 'apellidos', 'mail', 'identificacion')
    list_filter    = ('activo', 'id_rol')
    ordering       = ('apellidos', 'nombre')


# ============================================================
# CATEGORIA
# ============================================================
@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display   = ('id_categoria', 'codigo', 'nombre_categoria', 'descripcion',
                      'fecha_categoria', 'activo')
    search_fields  = ('codigo', 'nombre_categoria')
    list_filter    = ('activo',)
    ordering       = ('nombre_categoria',)


# ============================================================
# PROVEEDOR
# ============================================================
@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display   = ('id_proveedor', 'codigo', 'nombre_proveedor', 'nombre_empresa',
                      'mail', 'telefono', 'ciudad', 'direccion', 'fecha_proveedor', 'activo')
    search_fields  = ('codigo', 'nombre_proveedor', 'nombre_empresa', 'mail', 'ciudad')
    list_filter    = ('activo', 'ciudad')
    ordering       = ('nombre_proveedor',)


# ============================================================
# CALZADO
# ============================================================
@admin.register(Calzado)
class CalzadoAdmin(admin.ModelAdmin):
    list_display   = ('id_calzado', 'codigo', 'modelo', 'talla', 'color',
                      'stock_actual', 'id_categoria',
                      'id_proveedor', 'fecha_calzado', 'activo')
    search_fields  = ('codigo', 'modelo', 'color')
    list_filter    = ('activo', 'id_categoria', 'id_proveedor', 'talla')
    ordering       = ('modelo',)

    def stock_bajo(self, obj):
        return obj.stock_actual == 0
    stock_bajo.boolean           = True
    stock_bajo.short_description = '⚠️ Sin Stock'


# ============================================================
# TIPO MOVIMIENTO
# ============================================================
@admin.register(TipoMovimiento)
class TipoMovimientoAdmin(admin.ModelAdmin):
    list_display  = ('id_tipomovimiento', 'nombre_tipomovimiento', 'descripcion')
    search_fields = ('nombre_tipomovimiento',)
    ordering      = ('nombre_tipomovimiento',)


# ============================================================
# MOVIMIENTO
# ============================================================
@admin.register(Movimiento)
class MovimientoAdmin(admin.ModelAdmin):
    list_display   = ('id_movimiento', 'id_calzado', 'id_tipomovimiento',
                      'cantidad', 'id_usuario', 'fecha_movimiento', 'descripcion')
    search_fields  = ('id_calzado__codigo', 'id_calzado__modelo', 'id_usuario__usuario')
    list_filter    = ('id_tipomovimiento', 'fecha_movimiento')
    ordering       = ('-fecha_movimiento',)
