from rest_framework import serializers
from .models import Usuario, Rol, Calzado, Categoria, Proveedor, Movimiento, TipoMovimiento, FirmaFactura, FirmaUsuario
import hashlib

# ============================================================
# REGISTRO DE USUARIOS - Validaciones y creación de usuario
# ============================================================
class RegistroUsuarioSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True, label='Confirmar contraseña')

    class Meta:
        model  = Usuario
        fields = [
            'usuario',
            'nombre',
            'apellidos',
            'identificacion',
            'mail',
            'fecha_ingreso',
            'password',
            'password2',
        ]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Las contraseñas no coinciden.'})
        return data

    def validate_mail(self, value):
        if Usuario.objects.filter(mail=value).exists():
            raise serializers.ValidationError('Este correo ya está registrado.')
        return value

    def validate_usuario(self, value):
        if Usuario.objects.filter(usuario=value).exists():
            raise serializers.ValidationError('Este usuario ya existe.')
        return value

    def validate_identificacion(self, value):
        if Usuario.objects.filter(identificacion=value).exists():
            raise serializers.ValidationError('Esta identificación ya está registrada.')
        return value

    def create(self, validated_data):
        validated_data.pop('password2')
        raw_password = validated_data.pop('password')
        validated_data['password'] = hashlib.sha256(raw_password.encode()).hexdigest()
        rol_empleado = Rol.objects.get(nombre_rol__iexact='Empleado')
        validated_data['id_rol'] = rol_empleado
        return Usuario.objects.create(**validated_data)


# ============================================================
# LOGIN - Datos del usuario que se devuelven en el response
# ============================================================
class UsuarioLoginSerializer(serializers.ModelSerializer):
    nombre_rol = serializers.CharField(source='id_rol.nombre_rol', read_only=True)

    class Meta:
        model  = Usuario
        fields = [
            'id_usuario',
            'usuario',
            'nombre',
            'apellidos',
            'identificacion',   # ✅ AGREGADO: necesario para mostrar cédula en la tabla
            'mail',
            'activo',
            'nombre_rol',
            'fecha_ingreso',
            'ultimo_acceso',
        ]


# ============================================================
# CALZADO
# ============================================================
class CalzadoSerializer(serializers.ModelSerializer):
    nombre_categoria = serializers.CharField(source='id_categoria.nombre_categoria', read_only=True)
    nombre_proveedor = serializers.CharField(source='id_proveedor.nombre_proveedor', read_only=True)

    class Meta:
        model  = Calzado
        fields = [
            'id_calzado',
            'codigo',
            'fecha_calzado',
            'modelo',
            'talla',
            'color',
            'stock_actual',
            'activo',
            'id_categoria',
            'nombre_categoria',
            'id_proveedor',
            'nombre_proveedor',
        ]


# ============================================================
# CATEGORIA
# ============================================================
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Categoria
        fields = [
            'id_categoria',
            'codigo',
            'nombre_categoria',
            'descripcion',
            'fecha_categoria',
            'activo',
        ]


# ============================================================
# PROVEEDOR
# ============================================================
class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Proveedor
        fields = [
            'id_proveedor',
            'codigo',
            'nombre_proveedor',
            'nombre_empresa',
            'mail',
            'telefono',
            'ciudad',
            'direccion',
            'fecha_proveedor',
            'activo',
        ]


# ============================================================
# MOVIMIENTO
# ============================================================
class MovimientoSerializer(serializers.ModelSerializer):
    modelo         = serializers.CharField(source='id_calzado.modelo',                      read_only=True)
    talla          = serializers.CharField(source='id_calzado.talla',                       read_only=True)
    tipo           = serializers.CharField(source='id_tipomovimiento.nombre_tipomovimiento', read_only=True)
    nombre_usuario = serializers.SerializerMethodField()
    tiene_firma    = serializers.SerializerMethodField()

    class Meta:
        model  = Movimiento
        fields = [
            'id_movimiento',
            'cantidad',
            'fecha_movimiento',
            'descripcion',
            'id_calzado',
            'modelo',
            'talla',
            'id_tipomovimiento',
            'tipo',
            'id_usuario',
            'nombre_usuario',
            'tiene_firma',
        ]

    def get_nombre_usuario(self, obj):
        return f'{obj.id_usuario.nombre} {obj.id_usuario.apellidos}'

    def get_tiene_firma(self, obj):
        return hasattr(obj, 'firmafactura')


# ============================================================
# FIRMA FACTURA
# ============================================================
class FirmaFacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = FirmaFactura
        fields = [
            'id_firma',
            'id_movimiento',
            'tipo_firma',
            'firma_base64',
            'nombre_firma',
            'fecha_firma'
        ]

class FirmaUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = FirmaUsuario
        fields = [
            'id_firma_usuario',
            'id_usuario',
            'tipo_firma',
            'firma_base64',
            'nombre_firma'
        ]