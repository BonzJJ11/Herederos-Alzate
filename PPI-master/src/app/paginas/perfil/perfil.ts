import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, User, Mail, Phone, MapPin, Building, Calendar, Edit2, Save, X } from 'lucide-angular';
import { AuthService } from '../../nucleo/servicios/auth.service';

interface UserProfile {
  nombreCompleto: string;
  apellidoCompleto: string;
  usuario: string;
  cedula: string;
  correoPersonal: string;
  fechaIngreso: string;
  rol: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {

  // Íconos
  readonly UserIcon = User;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly MapPin = MapPin;
  readonly Building = Building;
  readonly Calendar = Calendar;
  readonly Edit2 = Edit2;
  readonly Save = Save;
  readonly X = X;

  // Estado de edición
  isEditing = false;

  // Datos reales del perfil (ahora se cargan de la BD)
  profile: any = null;

  // Objeto temporal para el formulario
  editForm: any = null;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.cargarDatosPerfil();
  }

  cargarDatosPerfil() {
    // 1. Carga instantánea desde el caché (si existe)
    const cachedUser = this.auth.getUserFull();
    if (cachedUser) {
      this.mapearDatosPerfil(cachedUser);
    }

    // 2. Consulta al servidor para sincronizar/actualizar
    this.auth.getPerfil().subscribe({
      next: (data) => {
        this.mapearDatosPerfil(data);
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
      }
    });
  }

  private mapearDatosPerfil(data: any) {
    this.profile = {
      nombreCompleto:   data.nombre,
      apellidoCompleto: data.apellidos,
      usuario:          data.usuario,
      cedula:           data.identificacion,
      correoPersonal:   data.mail,
      fechaIngreso:     data.fecha_ingreso,
      rol:              data.nombre_rol || data.rol, // Soporte para ambos nombres de campo
      activo:           data.activo
    };
    this.editForm = { ...this.profile };
  }

  isUsuario(): boolean {
    return this.auth.isUsuario();
  }

  toggleEdit() {
    if (!this.isEditing) {
      // Entrar en modo edición: clonamos los datos actuales
      this.editForm = { ...this.profile };
      this.isEditing = true;
    } else {
      // Cancelar edición
      this.isEditing = false;
    }
  }

  saveProfile() {
    const user = this.auth.getUsuario();
    if (!user) return;

    const payload = {
      nombre: this.editForm.nombreCompleto,
      apellidos: this.editForm.apellidoCompleto,
      mail: this.editForm.correoPersonal
    };

    this.auth.editarEmpleado(user.id_usuario, payload).subscribe({
      next: (updatedData) => {
        this.mapearDatosPerfil(updatedData);
        this.auth.actualizarCacheUsuario(updatedData);
        this.isEditing = false;
        alert('Perfil actualizado correctamente.');
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        alert('Hubo un error al guardar los cambios.');
      }
    });
  }
}
