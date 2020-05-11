class HeapMI {
	private adjustHeapFixup(array: any[], i): void {
		let j, temp;
		temp = array[i];
		j = (i - 1) / 2;
		while (j >= 0 && i != 0) {
			if (array[j] >= temp) break;
			array[i] = array[j];
			i = j;
			j = (i - 1) / 2;
		}
		array[i] = temp;
	}

	public MaxHeapAddNumber(array: any[], n, Num): void {
		array[n] = Num;
		this.adjustHeapFixup(array, n);
	}
}