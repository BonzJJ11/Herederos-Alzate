import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ShoppingBag, X } from 'lucide-angular';
import { CalzadoService } from '../../../app/nucleo/servicios/calzado.service';

@Component({
  selector: 'app-nuevo-calzado',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './nuevo-calzado.html',
  styleUrl: './nuevo-calzado.css',
})
export class NuevoCalzado implements OnInit {
  @Output() close = new EventEmitter<void>();

  ShoppingBag = ShoppingBag;
  X = X;

  categorias: any[] = [];
  proveedores: any[] = [];

  form = {
    codigo:       '',
    modelo:       '',
    talla:        '',
    color:        '',
    stock_actual: 0,
    fecha_calzado: new Date().toISOString().split('T')[0],
    id_categoria: 0,
    id_proveedor: 0,
    activo:       true,
  };

  constructor(private calzadoService: CalzadoService) {}

  ngOnInit() {
    this.calzadoService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        if (data.length > 0) this.form.id_categoria = data[0].id_categoria;
      },
      error: (err) => console.error('Error categorias:', err)
    });

    this.calzadoService.getProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
        if (data.length > 0) this.form.id_proveedor = data[0].id_proveedor;
      },
      error: (err) => console.error('Error proveedores:', err)
    });
  }

  agregar() {
    if (!this.form.codigo || !this.form.modelo || !this.form.talla || !this.form.color) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    this.calzadoService.crearCalzado(this.form).subscribe({
      next: () => {
        this.close.emit();
      },
      error: (err) => console.error('Error creando calzado:', err)
    });
  }

  onClose(): void {
    this.close.emit();
  }
}