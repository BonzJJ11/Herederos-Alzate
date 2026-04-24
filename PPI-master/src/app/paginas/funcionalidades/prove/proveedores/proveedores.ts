import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Pencil, Trash2, Search, RefreshCw } from 'lucide-angular';
import { AgregarProveedor } from '../agregar-proveedor/agregar-proveedor';
import { AuthService } from '../../../../nucleo/servicios/auth.service';
import { CalzadoService } from '../../../../nucleo/servicios/calzado.service';

type ProviderStatus = 'Activo' | 'Inactivo';

interface ProviderItem {
  id: number;
  codigo: string;
  nombre_empresa: string;
  nombre_proveedor: string;
  telefono: string;
  mail: string;
  ciudad: string;
  direccion: string;
  estado: ProviderStatus;
}

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AgregarProveedor, FormsModule],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css'
})
export class Proveedores implements OnInit {
  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Search = Search;
  readonly RefreshCw = RefreshCw;

  showAddSupplier = false;
  searchText: string = '';
  statusFilter: string = 'Todos los estados';
  editProviderId: number | null = null;

  editForm = {
    codigo:           '',
    nombre_empresa:   '',
    nombre_proveedor: '',
    telefono:         '',
    mail:             '',
    ciudad:           '',
    direccion:        '',
  };

  providers: ProviderItem[] = [];

  constructor(
    private auth: AuthService,
    private calzadoService: CalzadoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.cargarProveedores(); }

  isUsuario(): boolean { return this.auth.isUsuario(); }

  cargarProveedores() {
    this.calzadoService.getProveedores().subscribe({
      next: (data: any[]) => {
        this.providers = data.map(p => ({
          id:               p.id_proveedor,
          codigo:           p.codigo,
          nombre_empresa:   p.nombre_empresa,
          nombre_proveedor: p.nombre_proveedor,
          telefono:         p.telefono,
          mail:             p.mail,
          ciudad:           p.ciudad,
          direccion:        p.direccion,
          estado:           p.activo ? 'Activo' : 'Inactivo'
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando proveedores:', err)
    });
  }

  get filteredProviders(): ProviderItem[] {
    return this.providers.filter(p => {
      const matchesSearch = !this.searchText ||
        p.codigo.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.nombre_empresa.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.nombre_proveedor.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesStatus = this.statusFilter === 'Todos los estados' || p.estado === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  getStatusClass(status: ProviderStatus): string {
    return status === 'Activo' ? 'status-active' : 'status-inactive';
  }

  openAddSupplier(): void  { this.showAddSupplier = true; }
  closeAddSupplier(): void { this.showAddSupplier = false; this.cargarProveedores(); }

  editProvider(provider: ProviderItem): void {
    if (this.editProviderId === provider.id) { this.cancelEdit(); return; }
    this.editProviderId = provider.id;
    this.editForm = {
      codigo:           provider.codigo,
      nombre_empresa:   provider.nombre_empresa,
      nombre_proveedor: provider.nombre_proveedor,
      telefono:         provider.telefono,
      mail:             provider.mail,
      ciudad:           provider.ciudad,
      direccion:        provider.direccion,
    };
  }

  saveEdit(): void {
    if (!this.editProviderId) return;

    const payload = {
      nombre_empresa:   this.editForm.nombre_empresa,
      nombre_proveedor: this.editForm.nombre_proveedor,
      telefono:         this.editForm.telefono,
      mail:             this.editForm.mail,
      ciudad:           this.editForm.ciudad,
      direccion:        this.editForm.direccion,
    };

    this.calzadoService.updateProveedor(this.editProviderId, payload).subscribe({
      next: () => { this.cargarProveedores(); this.cancelEdit(); },
      error: (err) => console.error('Error actualizando proveedor:', err)
    });
  }

  cancelEdit(): void { this.editProviderId = null; }

  deleteProvider(provider: ProviderItem): void {
    if (!confirm(`¿Eliminar proveedor "${provider.nombre_empresa}"?`)) return;

    this.calzadoService.deleteProveedor(provider.id).subscribe({
      next: () => this.cargarProveedores(),
      error: (err) => console.error('Error eliminando proveedor:', err)
    });
  }
}