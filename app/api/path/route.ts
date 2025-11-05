import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { dijkstra } from '@/lib/dijkstra';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fromNodeId = parseInt(searchParams.get('from') || '0');
    const toNodeId = parseInt(searchParams.get('to') || '0');

    if (!fromNodeId || !toNodeId) {
      return NextResponse.json(
        { error: 'Missing from or to node ID' },
        { status: 400 }
      );
    }

    // Fetch all nodes
    const { data: nodes, error: nodesError } = await supabase
      .from('graph_nodes')
      .select('*');

    if (nodesError) throw nodesError;

    // Fetch all edges
    const { data: edges, error: edgesError } = await supabase
      .from('graph_edges')
      .select('*');

    if (edgesError) throw edgesError;

    // Run Dijkstra's algorithm
    const path = dijkstra(nodes || [], edges || [], fromNodeId, toNodeId);

    if (!path || path.length === 0) {
      return NextResponse.json(
        { error: 'No path found' },
        { status: 404 }
      );
    }

    return NextResponse.json(path);
  } catch (error) {
    console.error('Error calculating path:', error);
    return NextResponse.json(
      { error: 'Failed to calculate path' },
      { status: 500 }
    );
  }
}
