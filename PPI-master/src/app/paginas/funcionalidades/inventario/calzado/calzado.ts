import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NuevoCalzado } from '../../../nuevo-calzado/nuevo-calzado';
import { LucideAngularModule, Plus, Pencil, Trash2, Search, ListFilter, RotateCcw, Filter } from 'lucide-angular';
import { AuthService } from '../../../../nucleo/servicios/auth.service';
import { CalzadoService } from '../../../../nucleo/servicios/calzado.service';

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
  selector: 'app-calzado',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, NuevoCalzado, FormsModule],
  templateUrl: './calzado.html',
  styleUrl: './calzado.css'
})
export class Calzado implements OnInit {
  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Search = Search;
  readonly ListFilter = ListFilter;
  readonly Filter = Filter;
  readonly RotateCcw = RotateCcw;

  showFilters: boolean = false;
  showAddShoe: boolean = false;
  searchText: string = '';
  selectedCategory: string = 'Todas';
  selectedSize: string = 'Todas';
  selectedStatus: string = 'Todos';
  editShoeId: number | null = null;
  categorias: any[] = [];
  proveedores: any[] = [];

  editForm = {
    id:           0,
    codigo:       '',
    modelo:       '',
    id_categoria: 0,
    talla:        '',
    color:        '',
    stock:        0,
    id_proveedor: 0,
  };

  shoes: ShoeItem[] = [];

  constructor(
    private auth: AuthService,
    private calzadoService: CalzadoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarCalzados();
    this.cargarCategorias();
    this.cargarProveedores();
  }

  isUsuario(): boolean { return this.auth.isUsuario(); }

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
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando calzados:', err)
    });
  }

  cargarCategorias() {
    this.calzadoService.getCategorias().subscribe({
      next: (data) => { this.categorias = data; this.cdr.detectChanges(); },
      error: (err) => console.error('Error categorias:', err)
    });
  }

  cargarProveedores() {
    this.calzadoService.getProveedores().subscribe({
      next: (data) => { this.proveedores = data; this.cdr.detectChanges(); },
      error: (err) => console.error('Error proveedores:', err)
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

  openAddShoe(): void  { this.showAddShoe = true; }
  closeAddShoe(): void { this.showAddShoe = false; this.cargarCalzados(); }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  resetFilters() {
    this.selectedCategory = 'Todas';
    this.selectedSize = 'Todas';
    this.selectedStatus = 'Todos';
    this.searchText = '';
  }

  get activeFiltersCount(): number {
    let count = 0;
    if (this.selectedCategory !== 'Todas') count++;
    if (this.selectedSize !== 'Todas') count++;
    if (this.selectedStatus !== 'Todos') count++;
    return count;
  }

  get filteredShoes(): ShoeItem[] {
    return this.shoes.filter(shoe => {
      const matchesSearch = !this.searchText ||
        shoe.codigo.toLowerCase().includes(this.searchText.toLowerCase()) ||
        shoe.modelo.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesCategory = this.selectedCategory === 'Todas' || shoe.categoria === this.selectedCategory;
      const matchesSize     = this.selectedSize === 'Todas' || shoe.talla === this.selectedSize;
      const matchesStatus   = this.selectedStatus === 'Todos' || shoe.estado === this.selectedStatus;
      return matchesSearch && matchesCategory && matchesSize && matchesStatus;
    });
  }

  editShoe(item: ShoeItem): void {
    if (this.editShoeId === item.id) { this.cancelEdit(); return; }
    this.editShoeId = item.id;
    this.editForm = {
      id:           item.id,
      codigo:       item.codigo,
      modelo:       item.modelo,
      id_categoria: item.id_categoria,
      talla:        item.talla,
      color:        item.color,
      stock:        item.stock,
      id_proveedor: item.id_proveedor,
    };
  }

  saveEdit(): void {
    if (!this.editShoeId) return;

    const payload = {
      modelo:       this.editForm.modelo,
      talla:        this.editForm.talla,
      color:        this.editForm.color,
      stock_actual: this.editForm.stock,
      id_categoria: this.editForm.id_categoria,
      id_proveedor: this.editForm.id_proveedor,
    };

    this.calzadoService.updateCalzado(this.editShoeId, payload).subscribe({
      next: () => { this.cargarCalzados(); this.cancelEdit(); },
      error: (err) => console.error('Error actualizando:', err)
    });
  }

  cancelEdit(): void { this.editShoeId = null; }

  deleteShoe(item: ShoeItem): void {
    if (!confirm(`¿Eliminar "${item.modelo}" (#${item.codigo})?`)) return;

    this.calzadoService.deleteCalzado(item.id).subscribe({
      next: () => this.cargarCalzados(),
      error: (err) => console.error('Error eliminando:', err)
    });
  }
}