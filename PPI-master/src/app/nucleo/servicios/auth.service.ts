import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export type UserRole = 'admin' | 'usuario' | null;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() {
    this.syncRoleThemeFromStorage();
  }

  private mapRol(nombre_rol: string): UserRole {
    const rol = nombre_rol?.toLowerCase().trim();
    if (rol === 'admin' || rol === 'administrador') return 'admin';
    return 'usuario';
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/login/`, {
      usuario: username,
      password: password
    }).pipe(
      tap((response: any) => {
        if (isPlatformBrowser(this.platformId)) {
          const role: string = this.mapRol(response.usuario.nombre_rol) ?? 'usuario';
          localStorage.setItem('accessToken',     response.tokens.access);
          localStorage.setItem('refreshToken',    response.tokens.refresh);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole',        role);
          localStorage.setItem('userName',        response.usuario.nombre);
          localStorage.setItem('userUsername',    response.usuario.usuario);
          localStorage.setItem('userId',          String(response.usuario.id_usuario));
          localStorage.setItem('userFull',        JSON.stringify(response.usuario));
          this.applyRoleTheme(role as UserRole);
        }
      })
    );
  }

  logout(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post(`${this.apiUrl}/api/auth/logout/`, {
      refresh: refreshToken
    }).pipe(
      tap(() => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.clear();
          this.applyRoleTheme(null);
        }
      })
    );
  }

  registrarEmpleado(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/register/`, data, {
      headers: this.getAuthHeaders()
    });
  }

  getEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/auth/usuarios/`, {
      headers: this.getAuthHeaders()
    });
  }

  editarEmpleado(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/auth/usuarios/${id}/`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ NUEVO
  eliminarEmpleado(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/auth/usuarios/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }

  // RECUPERACIÓN DE CONTRASEÑA
  forgotPassword(usuario_o_correo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/forgot-password/`, { usuario_o_correo });
  }

  verifyCode(usuario: string, codigo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/verify-code/`, { usuario, codigo });
  }

  resetPassword(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/reset-password/`, payload);
  }

  getAccessToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  getRole(): UserRole {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('userRole') as UserRole;
  }

  getUserName(): string {
    if (!isPlatformBrowser(this.platformId)) return '';
    return localStorage.getItem('userName') || '';
  }

  getUsuario(): { id_usuario: number } | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const id = localStorage.getItem('userId');
    if (!id) return null;
    return { id_usuario: Number(id) };
  }

  getUserFull(): any | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const userStr = localStorage.getItem('userFull');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getPerfil(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/auth/perfil/`, {
      headers: this.getAuthHeaders()
    });
  }

  isAdmin(): boolean   { return this.getRole() === 'admin'; }
  isUsuario(): boolean { return this.getRole() === 'usuario'; }

  syncRoleThemeFromStorage() {
    if (!isPlatformBrowser(this.platformId)) return;
    const role = localStorage.getItem('userRole') as UserRole;
    this.applyRoleTheme(role);
  }

  private applyRoleTheme(role: UserRole) {
    if (!isPlatformBrowser(this.platformId)) return;
    document.body.classList.remove('role-admin', 'role-usuario');
    if (role === 'admin')   document.body.classList.add('role-admin');
    if (role === 'usuario') document.body.classList.add('role-usuario');
  }

  actualizarCacheUsuario(data: any) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (data.nombre)    localStorage.setItem('userName',     data.nombre);
    if (data.usuario)   localStorage.setItem('userUsername', data.usuario);
    localStorage.setItem('userFull', JSON.stringify(data));
  }
}