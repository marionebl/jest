export interface ShardPair {
  shardCount: number;
  shardIndex: number;
}

export const parseShardPair = (pair: string): ShardPair => {
  const parseResult = parseShardPairResult(pair);

  if (parseResult instanceof Error) {
    throw parseResult;
  }

  return parseResult;
};

export const parseShardPairResult = (pair: string): Error | ShardPair => {
  const shardPair = pair
    .split('/')
    .filter(d => /^\d+$/.test(d))
    .map(d => parseInt(d, 10))
    .filter((shard: number) => !Number.isNaN(shard));

  const [shardIndex, shardCount] = shardPair;

  if (shardPair.length !== 2) {
    throw new Error(
      'The shard option requires a string in the format of <n>/<m>.',
    );
  }

  if (shardIndex === 0 || shardCount === 0) {
    throw new Error(
      'The shard option requires 1-based values, received 0 in the pair.',
    );
  }

  if (shardIndex > shardCount) {
    throw new Error(
      'The shard option <n>/<m> requires <n> to be lower or equal than <m>.',
    );
  }

  return {
    shardCount,
    shardIndex,
  };
};
