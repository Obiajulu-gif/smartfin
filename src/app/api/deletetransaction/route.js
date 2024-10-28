import prisma from '../../../lib/prisma';

export async function DELETE(req) {
  try {
    const data = await req.json();

    //assign the json data to these values
    const { userId, id } = data;

    //check if they exist, if not return error
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing transaction id' }), { status: 400 });
    }

    // Find the transaction to ensure it belongs to the user
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction || transaction.userId !== userId) {
      return new Response(JSON.stringify({ error: 'Transaction not found or user not authorized' }), { status: 404 });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ message: 'Transaction deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete transaction' }), { status: 500 });
  }
}
