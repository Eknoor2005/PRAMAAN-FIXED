import { auth, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'pramaan_access_token';

// ---- PRAMAAN access token (issued by our backend after Firebase verifies identity) ----

export function saveAccessToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAccessToken() {
  if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
}

// ---- Low-level fetch wrapper ----

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.error || `Request to ${path} failed (${res.status})`);
  }

  return body;
}

// ---- Auth: exchange a verified Firebase identity for a PRAMAAN session ----

export async function firebaseSignup(params: {
  idToken: string;
  firebaseUid: string;
  email: string;
  firstName: string;
  lastName: string;
  authMethod: string;
}) {
  const body = await apiFetch('/api/auth/firebase/signup', {
    method: 'POST',
    headers: { Authorization: `Bearer ${params.idToken}` },
    body: JSON.stringify({
      firebaseUid: params.firebaseUid,
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      authMethod: params.authMethod,
    }),
  });
  if (body?.data?.accessToken) saveAccessToken(body.data.accessToken);
  return body.data;
}

export async function firebaseLogin(params: { idToken: string; firebaseUid: string; email: string }) {
  const body = await apiFetch('/api/auth/firebase/login', {
    method: 'POST',
    headers: { Authorization: `Bearer ${params.idToken}` },
    body: JSON.stringify({ firebaseUid: params.firebaseUid, email: params.email }),
  });
  if (body?.data?.accessToken) saveAccessToken(body.data.accessToken);
  return body.data;
}

export async function firebaseSocialAuth(params: {
  idToken: string;
  firebaseUid: string;
  email: string;
  firstName: string;
  lastName: string;
  authMethod: string;
  photoURL?: string | null;
}) {
  const body = await apiFetch('/api/auth/firebase/social', {
    method: 'POST',
    headers: { Authorization: `Bearer ${params.idToken}` },
    body: JSON.stringify(params),
  });
  if (body?.data?.accessToken) saveAccessToken(body.data.accessToken);
  return body.data;
}

export function logout() {
  clearAccessToken();
}

// ---- Evidence ----

export interface EvidenceRecord {
  _id: string;
  fileUrl: string;
  fileType: 'document' | 'photo' | 'video' | 'audio';
  fileName: string;
  fileSize: number;
  fileHash: string;
  category?: string;
  description?: string;
  createdAt: string;
}

/** Uploads the raw file to Firebase Storage and returns its public download URL. */
export async function uploadFileToStorage(file: File): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be signed in to upload evidence.');

  const path = `evidence/${user.uid}/${Date.now()}-${file.name}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

function mapMimeToFileType(mime: string): 'document' | 'photo' | 'video' | 'audio' {
  if (mime.startsWith('image/')) return 'photo';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  return 'document';
}

export async function createEvidenceRecord(
  file: File,
  fileUrl: string,
  extra?: { category?: string; description?: string }
) {
  return apiFetch('/api/evidence', {
    method: 'POST',
    body: JSON.stringify({
      fileUrl,
      fileType: mapMimeToFileType(file.type),
      fileName: file.name,
      fileSize: file.size,
      category: extra?.category,
      description: extra?.description,
    }),
  }).then((body) => body.data as EvidenceRecord);
}

export async function listEvidence(): Promise<EvidenceRecord[]> {
  const body = await apiFetch('/api/evidence');
  return body.data as EvidenceRecord[];
}

export async function deleteEvidenceRecord(id: string) {
  return apiFetch(`/api/evidence/${id}`, { method: 'DELETE' });
}
