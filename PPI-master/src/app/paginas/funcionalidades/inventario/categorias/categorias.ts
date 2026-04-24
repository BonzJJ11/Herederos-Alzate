import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Pencil, Trash2, Search } from 'lucide-angular';
import { NuevaCategoria } from '../../../nueva-categoria/nueva-categoria';
import { AuthService } from '../../../../nucleo/servicios/auth.service';
import { CalzadoService } from '../../../../nucleo/servicios/calzado.service';

type CategoryStatus = 'Activa' | 'Inactiva';

interface CategoryItem {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  estado: CategoryStatus;
}

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, NuevaCategoria, FormsModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class Categorias implements OnInit {
  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Search = Search;

  showAddCategory: boolean = false;
  searchText: string = '';
  statusFilter: string = 'Todos los estados';
  editCategoryId: number | null = null;

  editForm = {
    codigo:      '',
    nombre:      '',
    descripcion: '',
  };

  categories: CategoryItem[] = [];

  constructor(
    private auth: AuthService,
    private calzadoService: CalzadoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  isUsuario(): boolean { return this.auth.isUsuario(); }

  cargarCategorias() {
    this.calzadoService.getCategorias().subscribe({
      next: (data: any[]) => {
        this.categories = data.map(c => ({
          id:          c.id_categoria,
          codigo:      c.codigo,
          nombre:      c.nombre_categoria,
          descripcion: c.descripcion,
          estado:      c.activo ? 'Activa' : 'Inactiva'
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando categorias:', err)
    });
  }

  get filteredCategories(): CategoryItem[] {
    return this.categories.filter(c => {
      const matchesSearch = !this.searchText ||
        c.codigo.toLowerCase().includes(this.searchText.toLowerCase()) ||
        c.nombre.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesStatus = this.statusFilter === 'Todos los estados' || c.estado === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  getStatusClass(status: CategoryStatus): string {
    return status === 'Activa' ? 'status-active' : 'status-inactive';
  }

  openAddCategory(): void  { this.showAddCategory = true; }
  closeAddCategory(): void { this.showAddCategory = false; this.cargarCategorias(); }

  editCategory(category: CategoryItem): void {
    if (this.editCategoryId === category.id) { this.cancelEdit(); return; }
    this.editCategoryId = category.id;
    this.editForm = {
      codigo:      category.codigo,
      nombre:      category.nombre,
      descripcion: category.descripcion,
    };
  }

  saveEdit(): void {
    if (!this.editCategoryId) return;

    const payload = {
      nombre_categoria: this.editForm.nombre,
      descripcion:      this.editForm.descripcion,
    };

    this.calzadoService.updateCategoria(this.editCategoryId, payload).subscribe({
      next: () => { this.cargarCategorias(); this.cancelEdit(); },
      error: (err) => console.error('Error actualizando categoria:', err)
    });
  }

  cancelEdit(): void { this.editCategoryId = null; }

  deleteCategory(category: CategoryItem): void {
    if (!confirm(`¿Eliminar categoría "${category.nombre}"?`)) return;

    this.calzadoService.deleteCategoria(category.id).subscribe({
      next: () => this.cargarCategorias(),
      error: (err) => console.error('Error eliminando categoria:', err)
    });
  }
}