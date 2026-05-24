.ONESHELL:
.PHONY: beautiful jacobus reset works

beautiful: jacobus

jacobus: works
	conda run -n works pip install 'jacobus>=2.0,<3';
	conda run -n works python -m jacobus @make/jacobus.txt;

reset:
	git reset HEAD~1;

works:
	@conda env list | awk '{print $$1}' | grep -qx 'works' \
	|| conda create --name works --yes --channel conda-forge --override-channels python=3.11;
