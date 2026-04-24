import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Minus, X } from 'lucide-angular';
import { CalzadoService } from '../../nucleo/servicios/calzado.service';
import { AuthService } from '../../nucleo/servicios/auth.service';

@Component({
  selector: 'app-agregar-salida',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './agregar-salida.html',
  styleUrl: './agregar-salida.css',
})
export class AgregarSalida implements OnInit {
  @Output() close = new EventEmitter<void>();

  readonly Minus = Minus;
  readonly X = X;

  calzados: any[] = [];

  form = {
    id_calzado:       null as number | null,
    cantidad:         null as number | null,
    fecha_movimiento: '',
    descripcion:      '',
  };

  constructor(
    private calzadoService: CalzadoService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.calzadoService.getCalzados().subscribe({
      next: (data) => this.calzados = data,
      error: (err) => console.error('Error cargando calzados:', err)
    });
  }

  guardar() {
    if (!this.form.id_calzado || !this.form.cantidad || !this.form.fecha_movimiento) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const payload = {
      id_calzado:       this.form.id_calzado,
      cantidad:         this.form.cantidad,
      fecha_movimiento: this.form.fecha_movimiento,
      descripcion:      this.form.descripcion,
      id_usuario:       this.auth.getUsuario()?.id_usuario,
    };

    this.calzadoService.registrarSalida(payload).subscribe({
      next: () => {
        alert('Salida registrada exitosamente.');
        this.close.emit();
      },
      error: (err) => {
        console.error('Error registrando salida:', err);
        const msg = err.error?.error || 'No se pudo registrar la salida. Verifica los datos.';
        alert('Error: ' + msg);
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }
}