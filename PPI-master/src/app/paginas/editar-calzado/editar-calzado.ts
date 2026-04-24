import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Trash2, Pencil, Package } from 'lucide-angular';
import { CalzadoService } from '../../nucleo/servicios/calzado.service';

// ...existing code...

type Status = 'En Stock' | 'Stock Bajo' | 'Sin Stock';

interface ShoeItem {
  id: number;
  codigo: string;
  modelo: string;
  categoria: string;
  id_categoria: number;
  talla: string;
  color: string;
  stock: number;
  proveedor: string;
  id_proveedor: number;
  estado: Status;
}

@Component({
  selector: 'app-editar-calzado',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './editar-calzado.html',
  styleUrls: ['./editar-calzado.css']
})
export class EditarCalzado implements OnInit {

  readonly Search = Search;
  readonly Trash2 = Trash2;
  readonly Pencil = Pencil;
  readonly Package = Package;

  searchTerm: string = '';
  statusFilter: 'Todos' | Status = 'Todos';
  showEditMenu = false;
  editShoeId: number | null = null;
  categorias: any[] = [];
  proveedores: any[] = [];

  editForm = {
    modelo: '',
    id_categoria: 0,
    talla: '',
    color: '',
    stock: 0,
    id_proveedor: 0,
    codigo: '',
  };

  shoes: ShoeItem[] = [];

  private calzadoService = inject(CalzadoService);

  ngOnInit() {
    this.cargarCalzados();
    this.cargarCategorias();
    this.cargarProveedores();
  }

  cargarCalzados() {
    this.calzadoService.getCalzados().subscribe({
      next: (data: any[]) => {
        this.shoes = data.map(c => ({
          id:           c.id_calzado,
          codigo:       c.codigo,
          modelo:       c.modelo,
          categoria:    c.nombre_categoria,
          id_categoria: c.id_categoria,
          talla:        c.talla,
          color:        c.color,
          stock:        c.stock_actual,
          proveedor:    c.nombre_proveedor,
          id_proveedor: c.id_proveedor,
          estado:       this.calcularEstado(c.stock_actual)
        }));
      },
      error: (err: any) => console.error('Error cargando calzados:', err)
    });
  }

  cargarCategorias() {
    this.calzadoService.getCategorias().subscribe({
      next: (data: any) => this.categorias = data,
      error: (err: any) => console.error('Error cargando categorias:', err)
    });
  }

  cargarProveedores() {
    this.calzadoService.getProveedores().subscribe({
      next: (data: any) => this.proveedores = data,
      error: (err: any) => console.error('Error cargando proveedores:', err)
    });
  }

  calcularEstado(stock: number): Status {
    if (stock === 0)  return 'Sin Stock';
    if (stock <= 10)  return 'Stock Bajo';
    return 'En Stock';
  }

  getStatusClass(status: Status): string {
    if (status === 'En Stock')   return 'status-ok';
    if (status === 'Stock Bajo') return 'status-low';
    return 'status-out';
  }

  getStockClass(stock: number): string {
    if (stock === 0)  return 'stock-out';
    if (stock <= 10)  return 'stock-low';
    return 'strong';
  }

  get filteredShoes() {
    const search = this.searchTerm.toLowerCase().trim();
    return this.shoes.filter(shoe =>
      (shoe.codigo.toLowerCase().includes(search) ||
       shoe.modelo.toLowerCase().includes(search)) &&
      (this.statusFilter === 'Todos' || shoe.estado === this.statusFilter)
    );
  }

  // ── Editar por fila ──────────────────────────────────────
  editRow(shoe: ShoeItem) {
    if (this.showEditMenu && this.editShoeId === shoe.id) {
      this.closeEditMenu();
      return;
    }
    this.editShoeId = shoe.id;
    this.editForm = {
      codigo:       shoe.codigo,
      modelo:       shoe.modelo,
      id_categoria: shoe.id_categoria,
      talla:        shoe.talla,
      color:        shoe.color,
      stock:        shoe.stock,
      id_proveedor: shoe.id_proveedor,
    };
    this.showEditMenu = true;
  }

  saveEditMenu() {
    console.log('>>> saveEditMenu llamado');
    console.log('editShoeId:', this.editShoeId);
    console.log('editForm:', this.editForm);

    if (!this.editShoeId) {
      console.warn('>>> editShoeId es null, abortando');
      return;
    }

    const payload = {
      modelo:       this.editForm.modelo,
      talla:        this.editForm.talla,
      color:        this.editForm.color,
      stock_actual: this.editForm.stock,
      id_categoria: this.editForm.id_categoria,
      id_proveedor: this.editForm.id_proveedor,
    };

    console.log('>>> payload a enviar:', payload);

    this.calzadoService.updateCalzado(this.editShoeId, payload).subscribe({
      next: (res: any) => {
        console.log('>>> PUT exitoso:', res);
        this.cargarCalzados();
        this.closeEditMenu();
      },
      error: (err: any) => console.error('>>> Error actualizando calzado:', err)
    });
  }

  closeEditMenu() {
    this.showEditMenu = false;
    this.editShoeId = null;
  }

  // ── Eliminar por fila ────────────────────────────────────
  deleteRow(shoe: ShoeItem) {
    console.log('>>> deleteRow llamado para:', shoe.id, shoe.modelo);

    if (!confirm(`¿Eliminar "${shoe.modelo}" (#${shoe.codigo})?`)) return;

    this.calzadoService.deleteCalzado(shoe.id).subscribe({
      next: (res: any) => {
        console.log('>>> DELETE exitoso:', res);
        this.cargarCalzados();
        if (this.editShoeId === shoe.id) this.closeEditMenu();
      },
      error: (err: any) => console.error('>>> Error eliminando calzado:', err)
    });
  }
}
