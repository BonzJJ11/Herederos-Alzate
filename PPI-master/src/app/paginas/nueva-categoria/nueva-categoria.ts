import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Tag, X } from 'lucide-angular';
import { CalzadoService } from '../../../app/nucleo/servicios/calzado.service';

@Component({
  selector: 'app-nueva-categoria',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './nueva-categoria.html',
  styleUrl: './nueva-categoria.css',
})
export class NuevaCategoria {
  @Output() close = new EventEmitter<void>();

  readonly Tag = Tag;
  readonly X = X;

  form = {
    codigo:           '',
    nombre_categoria: '',
    descripcion:      '',
    fecha_categoria:  new Date().toISOString().split('T')[0],
    activo:           true,
  };

  constructor(private calzadoService: CalzadoService) {}

  agregar() {
    if (!this.form.codigo || !this.form.nombre_categoria) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    this.calzadoService.crearCategoria(this.form).subscribe({
      next: () => this.close.emit(),
      error: (err) => console.error('Error creando categoria:', err)
    });
  }

  onClose(): void {
    this.close.emit();
  }
}