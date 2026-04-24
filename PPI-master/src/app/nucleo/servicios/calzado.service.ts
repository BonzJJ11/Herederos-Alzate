import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CalzadoService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = environment.apiUrl;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getAccessToken()}`
    });
  }

  // CALZADO
  getCalzados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/calzado/`, { headers: this.getHeaders() });
  }

  crearCalzado(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/calzado/`, data, { headers: this.getHeaders() });
  }

  updateCalzado(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/calzado/${id}/`, data, { headers: this.getHeaders() });
  }

  deleteCalzado(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/calzado/${id}/`, { headers: this.getHeaders() });
  }

  // CATEGORIAS
  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/categorias/`, { headers: this.getHeaders() });
  }

  crearCategoria(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/categorias/`, data, { headers: this.getHeaders() });
  }

  updateCategoria(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/categorias/${id}/`, data, { headers: this.getHeaders() });
  }

  deleteCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/categorias/${id}/`, { headers: this.getHeaders() });
  }

  // PROVEEDORES
  getProveedores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/proveedores/`, { headers: this.getHeaders() });
  }

  crearProveedor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/proveedores/`, data, { headers: this.getHeaders() });
  }

  updateProveedor(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/proveedores/${id}/`, data, { headers: this.getHeaders() });
  }

  deleteProveedor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/proveedores/${id}/`, { headers: this.getHeaders() });
  }

  // MOVIMIENTOS
  getMovimientos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/movimientos/`, { headers: this.getHeaders() });
  }

  registrarEntrada(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/movimientos/entrada/`, data, { headers: this.getHeaders() });
  }

  registrarSalida(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/movimientos/salida/`, data, { headers: this.getHeaders() });
  }

  // FIRMA DIGITAL
  obtenerMisFirmas(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/movimientos/mis-firmas/?usuario_id=${usuarioId}`, { headers: this.getHeaders() });
  }

  obtenerFirma(idMovimiento: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/movimientos/${idMovimiento}/firma/`, { headers: this.getHeaders() });
  }

  guardarFirma(idMovimiento: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/movimientos/${idMovimiento}/firma/`, data, { headers: this.getHeaders() });
  }
}