import { NextResponse } from 'next/server';
import { deleteUserAccountDAL } from '@/dal/settings';

export async function POST() {
  try {
    await deleteUserAccountDAL();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao excluir conta.' },
      { status: 500 }
    );
  }
}
