import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Briefcase, X } from 'lucide-angular';
import { CalzadoService } from '../../../../nucleo/servicios/calzado.service';

@Component({
  selector: 'app-agregar-proveedor',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './agregar-proveedor.html',
  styleUrl: './agregar-proveedor.css'
})
export class AgregarProveedor {
  @Output() close = new EventEmitter<void>();

  readonly Briefcase = Briefcase;
  readonly X = X;

  form = {
    codigo:           '',
    nombre_empresa:   '',
    nombre_proveedor: '',
    telefono:         '',
    mail:             '',
    ciudad:           '',
    direccion:        '',
    fecha_proveedor:  new Date().toISOString().split('T')[0],
    activo:           true,
  };

  constructor(private calzadoService: CalzadoService) {}

  agregar() {
    if (!this.form.codigo || !this.form.nombre_empresa || !this.form.nombre_proveedor) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    this.calzadoService.crearProveedor(this.form).subscribe({
      next: () => this.close.emit(),
      error: (err) => console.error('Error creando proveedor:', err)
    });
  }

  onClose(): void {
    this.close.emit();
  }
}