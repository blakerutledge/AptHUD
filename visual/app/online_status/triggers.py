"""

	Internet Connectivity Monitor

	tests for 200s from google on an interval
	update state with whether or not we are connected


"""

console = op.console



class triggers:
	
	def __init__(self, ownerComp):
		return

	def Check( self ):

		op('web1').par.clear.pulse()
		op('web1').par.request.pulse()

		return
	